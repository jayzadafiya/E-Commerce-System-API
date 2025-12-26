import { Router } from 'express';
import sellerRoutes from '../modules/seller/seller.route';
import brandRoutes from '../modules/brand/brand.route';
import productRoutes from '../modules/product/product.route';

const router = Router();

router.use('/sellers', sellerRoutes);
router.use('/brands', brandRoutes);
router.use('/products', productRoutes);

export default router;
