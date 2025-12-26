import { Router } from 'express';
import validate from '../../middlewares/validate';
import { createProductSchema, listProductsQuerySchema } from './product.validation';
import { createProduct, listProducts, getProduct } from './product.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', validate({ body: createProductSchema }), createProduct);
router.get('/', validate({ query: listProductsQuerySchema }), listProducts);
router.get('/:id', getProduct);

export default router;
