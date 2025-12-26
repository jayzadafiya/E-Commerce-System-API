import { Router } from 'express';
import validate from '../../middlewares/validate';
import { registerSchema, loginSchema } from './user.validation';
import { register, login } from './user.controller';

const router = Router();

router.post('/register', validate({ body: registerSchema }), register);
router.post('/login', validate({ body: loginSchema }), login);

export default router;
