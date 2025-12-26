import Cart from './cart.model';
import Product from '../product/product.model';
import Coupon from '../coupon/coupon.model';
import User from '../user/user.model';
import { NotFoundError, BadRequestError } from '../../middlewares/errorHandler';
import { ICart, CartTotal } from '../../types';

class CartService {
  async addItem(userId: string, productId: string, quantity: number): Promise<ICart> {
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    if (!product.isActive) throw new BadRequestError('Product is not available');
    if (product.stock < quantity) throw new BadRequestError('Insufficient stock');

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        if (cart.items[itemIndex].quantity > product.stock) {
          throw new BadRequestError('Insufficient stock');
        }
      } else {
        cart.items.push({ productId: productId as any, quantity });
      }

      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id).populate('items.productId', 'name price stock');
    return populatedCart!;
  }

  async getCart(userId: string): Promise<ICart | null> {
    return await Cart.findOne({ userId }).populate('items.productId', 'name price stock');
  }

  async calculateTotal(userId: string, couponCode?: string, useWalletPoints?: number): Promise<CartTotal> {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) throw new BadRequestError('Cart is empty');

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    let subtotal = 0;
    for (const item of cart.items) {
      const product: any = item.productId;
      if (!product.isActive) throw new BadRequestError(`Product ${product.name} is not available`);
      if (product.stock < item.quantity) throw new BadRequestError(`Insufficient stock for ${product.name}`);
      subtotal += product.price * item.quantity;
    }

    let discount = 0;
    let couponDiscount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
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
      appliedCoupon = { code: coupon.code, discount: couponDiscount };
    }

    let walletPointsUsed = 0;
    if (useWalletPoints && useWalletPoints > 0) {
      if (useWalletPoints > user.walletPoints) {
        throw new BadRequestError('Insufficient wallet points');
      }
      walletPointsUsed = Math.min(useWalletPoints, subtotal - discount);
      discount += walletPointsUsed;
    }

    const total = Math.max(0, subtotal - discount);

    return {
      subtotal,
      discount,
      total,
      couponDiscount: appliedCoupon,
      walletPointsUsed,
      availableWalletPoints: user.walletPoints,
    };
  }
}

export default new CartService();
