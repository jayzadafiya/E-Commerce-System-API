import { Router } from 'express';
import validate from '../../middlewares/validate';
import { registerSchema, loginSchema } from './seller.validation';
import { register, login } from './seller.controller';

const router = Router();

router.post('/register', validate({ body: registerSchema }), register);
router.post('/login', validate({ body: loginSchema }), login);

export default router;
