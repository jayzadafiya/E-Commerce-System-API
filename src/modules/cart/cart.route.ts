import { Router } from 'express';
import validate from '../../middlewares/validate';
import { addToCartSchema } from './cart.validation';
import { addToCart, getCart } from './cart.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', validate({ body: addToCartSchema }), addToCart);
router.get('/', getCart);

export default router;
