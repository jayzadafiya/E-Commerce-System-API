import { Router } from 'express';
import validate from '../../middlewares/validate';
import { placeOrderSchema } from './order.validation';
import { placeOrder } from './order.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', validate({ body: placeOrderSchema }), placeOrder);

export default router;
