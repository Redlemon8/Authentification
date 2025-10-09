import { Router } from 'express';
import authController from './controllers/auth.controller';

const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.get('/auth/verify-email', authController.verifyEmail);
router.post('/auth/resend-verification-email', authController.resendVerificationEmail);

export default router;