import { Router } from 'express';
import validate from '../../middlewares/validate';
import { createCouponSchema, listCouponsQuerySchema } from './coupon.validation';
import { createCoupon, listCoupons, getCoupon } from './coupon.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', validate({ body: createCouponSchema }), createCoupon);
router.get('/', validate({ query: listCouponsQuerySchema }), listCoupons);
router.get('/:id', getCoupon);

export default router;
