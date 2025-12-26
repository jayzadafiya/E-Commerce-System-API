import { Router } from 'express';
import validate from '../../middlewares/validate';
import { placeOrderSchema, handlePaymentSchema } from './order.validation';
import { placeOrder, handlePayment } from './order.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', validate({ body: placeOrderSchema }), placeOrder);
router.patch('/:id/payment', validate({ body: handlePaymentSchema }), handlePayment);

export default router;
