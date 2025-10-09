import { Router } from 'express';
import authController from './controllers/auth.controller';
import { validate } from './middlewares/validation';
import { createUserSchema } from './schema/userSchema';
import { cw } from './middlewares/handleError';

const router = Router();

router.post('/auth/register', validate(createUserSchema), cw(authController.register));

export default router;