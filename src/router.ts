import { Router } from 'express';
import authController from './controllers/auth.controller';
import { validate } from './middlewares/validation';
import { createUserSchema } from './schema/userSchema';
import { cw } from './middlewares/handleError';
import { RegisterBody } from './types/express';
import authService from './services/auth.service';

const router = Router();

router.post('/auth/register', validate(createUserSchema), cw<RegisterBody>(authController.register));

// Route pour confirmer l'email
router.get('/auth/confirm-email/:token', (req, res) => {
  authService.confirmEmail(req.params.token)
    .then(result => {
      res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: green;">✅ Email confirmé !</h1>
            <p>${result.message}</p>
          </body>
        </html>
      `);
    })
    .catch(error => {
      res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: red;">❌ Erreur</h1>
            <p>${error.message}</p>
          </body>
        </html>
      `);
    });
});
export default router;