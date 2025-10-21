import { Router } from 'express';
import authController from './controllers/auth.controller';
import { validate } from './middlewares/validation';
import { createUserSchema } from './schema/userSchema';
import { cw } from './middlewares/handleError';
import { RegisterBody } from './types/express';

const router = Router();

router.post('/auth/register', validate(createUserSchema), cw<RegisterBody>(authController.register));

export default router;