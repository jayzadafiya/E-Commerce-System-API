import { Router } from 'express';
import sellerRoutes from '../modules/seller/seller.route';
import brandRoutes from '../modules/brand/brand.route';

const router = Router();

router.use('/sellers', sellerRoutes);
router.use('/brands', brandRoutes);

export default router;
