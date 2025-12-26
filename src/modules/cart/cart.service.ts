import Cart from './cart.model';
import Product from '../product/product.model';
import { NotFoundError, BadRequestError } from '../../middlewares/errorHandler';
import { ICart } from '../../types';

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
}

export default new CartService();
