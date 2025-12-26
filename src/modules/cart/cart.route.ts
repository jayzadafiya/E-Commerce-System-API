import { Router } from 'express';
import validate from '../../middlewares/validate';
import { addToCartSchema, calculateTotalSchema } from './cart.validation';
import { addToCart, getCart, calculateTotal } from './cart.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', validate({ body: addToCartSchema }), addToCart);
router.get('/', getCart);
router.post('/calculate', validate({ body: calculateTotalSchema }), calculateTotal);

export default router;
