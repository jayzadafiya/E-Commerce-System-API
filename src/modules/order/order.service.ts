import Order from './order.model';
import Cart from '../cart/cart.model';
import Product from '../product/product.model';
import Coupon from '../coupon/coupon.model';
import User from '../user/user.model';
import { NotFoundError, BadRequestError } from '../../middlewares/errorHandler';
import { IOrder } from '../../types';
import mongoose from 'mongoose';

class OrderService {
  async placeOrder(userId: string, couponCode?: string, useWalletPoints?: number): Promise<IOrder> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const cart = await Cart.findOne({ userId }).populate('items.productId').session(session);
      if (!cart || cart.items.length === 0) throw new BadRequestError('Cart is empty');

      const user = await User.findById(userId).session(session);
      if (!user) throw new NotFoundError('User not found');

      let subtotal = 0;
      const orderItems = [];

      for (const item of cart.items) {
        const product: any = item.productId;
        if (!product.isActive) throw new BadRequestError(`Product ${product.name} is not available`);
        if (product.stock < item.quantity) throw new BadRequestError(`Insufficient stock for ${product.name}`);

        subtotal += product.price * item.quantity;
        orderItems.push({
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      let discount = 0;
      let couponDiscount = 0;
      let appliedCouponCode = null;

      if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true }).session(session);
        if (!coupon) throw new BadRequestError('Invalid coupon code');

        const now = new Date();
        if (now < coupon.validFrom || now > coupon.validUntil) {
          throw new BadRequestError('Coupon is not valid at this time');
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          throw new BadRequestError('Coupon usage limit reached');
        }

        if (subtotal < coupon.minPurchase) {
          throw new BadRequestError(`Minimum purchase of ${coupon.minPurchase} required for this coupon`);
        }

        if (coupon.discountType === 'percentage') {
          couponDiscount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && couponDiscount > coupon.maxDiscount) {
            couponDiscount = coupon.maxDiscount;
          }
        } else {
          couponDiscount = coupon.discountValue;
        }

        discount += couponDiscount;
        appliedCouponCode = coupon.code;

        await Coupon.findByIdAndUpdate(
          coupon._id,
          { $inc: { usedCount: 1 } },
          { session }
        );
      }

      let walletPointsUsed = 0;
      if (useWalletPoints && useWalletPoints > 0) {
        if (useWalletPoints > user.walletPoints) {
          throw new BadRequestError('Insufficient wallet points');
        }
        walletPointsUsed = Math.min(useWalletPoints, subtotal - discount);
        discount += walletPointsUsed;

        await User.findByIdAndUpdate(
          userId,
          { $inc: { walletPoints: -walletPointsUsed } },
          { session }
        );
      }

      const total = Math.max(0, subtotal - discount);

      const order = await Order.create(
        [
          {
            userId,
            items: orderItems,
            subtotal,
            discount,
            total,
            couponCode: appliedCouponCode,
            couponDiscount,
            walletPointsUsed,
          },
        ],
        { session }
      );

      await Cart.findOneAndDelete({ userId }, { session });

      await session.commitTransaction();
      return order[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async handlePayment(orderId: string, paymentStatus: 'success' | 'failed'): Promise<IOrder> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      if (!order) throw new NotFoundError('Order not found');
      if (order.paymentStatus !== 'pending') throw new BadRequestError('Payment already processed');

      order.paymentStatus = paymentStatus;

      if (paymentStatus === 'success') {
        const bulkOps = [];
        for (const item of order.items) {
          const product = await Product.findById(item.productId).session(session);
          if (!product) throw new NotFoundError('Product not found');
          if (product.stock < item.quantity) throw new BadRequestError(`Insufficient stock for product`);

          const newStock = product.stock - item.quantity;
          bulkOps.push({
            updateOne: {
              filter: { _id: item.productId },
              update: { 
                $inc: { stock: -item.quantity },
                ...(newStock === 0 && { $set: { isActive: false } })
              },
            },
          });
        }

        if (bulkOps.length > 0) {
          await Product.bulkWrite(bulkOps, { session });
        }
      } else {
        if (order.walletPointsUsed > 0) {
          await User.findByIdAndUpdate(
            order.userId,
            { $inc: { walletPoints: order.walletPointsUsed } },
            { session }
          );
        }

        if (order.couponCode) {
          await Coupon.findOneAndUpdate(
            { code: order.couponCode },
            { $inc: { usedCount: -1 } },
            { session }
          );
        }
      }

      await order.save({ session });
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export default new OrderService();
