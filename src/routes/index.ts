import { Router } from 'express';
import sellerRoutes from '../modules/seller/seller.route';
import brandRoutes from '../modules/brand/brand.route';
import productRoutes from '../modules/product/product.route';
import couponRoutes from '../modules/coupon/coupon.route';
import userRoutes from '../modules/user/user.route';

const router = Router();

router.use('/sellers', sellerRoutes);
router.use('/brands', brandRoutes);
router.use('/products', productRoutes);
router.use('/coupons', couponRoutes);
router.use('/users', userRoutes);

export default router;
