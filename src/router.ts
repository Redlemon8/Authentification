import { Router } from 'express';
import authController from './controllers/auth.controller';
import { validate } from './middlewares/validation';
import { createUserSchema } from './schema/userSchema';
import { cw } from './middlewares/handleError';
import { RegisterBody } from './types/express';
import authService from './services/auth.service';

const router = Router();

router.post('/auth/register', validate(createUserSchema), cw<RegisterBody>(authController.register));

// Route pour confirmer l'email, si nous etions connectés à un frontend, nous pourrions rediriger vers la page de confirmation
router.get('/auth/confirm-email/:token', cw(async (req, res) => {
  const result = await authService.confirmEmail(req.params.token ?? '');
  
  res.status(200).send(`
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: green;">✅ Email confirmé !</h1>
        <p>${result.message}</p>
      </body>
    </html>
  `);
}));

export default router;