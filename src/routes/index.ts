import { Router } from 'express';
import sellerRoutes from '../modules/seller/seller.route';

const router = Router();

router.use('/sellers', sellerRoutes);

export default router;
