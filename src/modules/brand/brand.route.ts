import { Router } from 'express';
import validate from '../../middlewares/validate';
import { createBrandSchema, listBrandsQuerySchema } from './brand.validation';
import { createBrand, listBrands, getBrand } from './brand.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', validate({ body: createBrandSchema }), createBrand);
router.get('/', validate({ query: listBrandsQuerySchema }), listBrands);
router.get('/:id', getBrand);

export default router;
