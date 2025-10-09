import { Request, Response, NextFunction } from 'express';

interface AuthController {
  register: (req: Request, res: Response, next: NextFunction) => void;
  login: (req: Request, res: Response, next: NextFunction) => void;
  logout: (req: Request, res: Response, next: NextFunction) => void;
  refresh: (req: Request, res: Response, next: NextFunction) => void;
  forgotPassword: (req: Request, res: Response, next: NextFunction) => void;
  resetPassword: (req: Request, res: Response, next: NextFunction) => void;
  verifyEmail: (req: Request, res: Response, next: NextFunction) => void;
  resendVerificationEmail: (req: Request, res: Response, next: NextFunction) => void;
}

const authController: AuthController = {
  register: (req: Request, res: Response, next: NextFunction): void => {
    // TODO: Implémenter l'inscription
    res.status(501).json({ message: 'Inscription non implémentée' });
  },

  login: (req: Request, res: Response, next: NextFunction): void => {
    // TODO: Implémenter la connexion
    res.status(501).json({ message: 'Connexion non implémentée' });
  },

  logout: (req: Request, res: Response, next: NextFunction): void => {
    // TODO: Implémenter la déconnexion
    res.status(501).json({ message: 'Déconnexion non implémentée' });
  },

  refresh: (req: Request, res: Response, next: NextFunction): void => {
    // TODO: Implémenter le refresh token
    res.status(501).json({ message: 'Refresh token non implémenté' });
  },

  forgotPassword: (req: Request, res: Response, next: NextFunction): void => {
    // TODO: Implémenter la récupération de mot de passe
    res.status(501).json({ message: 'Récupération de mot de passe non implémentée' });
  },

  resetPassword: (req: Request, res: Response, next: NextFunction): void => {
    // TODO: Implémenter la réinitialisation de mot de passe
    res.status(501).json({ message: 'Réinitialisation de mot de passe non implémentée' });
  },

  verifyEmail: (req: Request, res: Response, next: NextFunction): void => {
    // TODO: Implémenter la vérification d'email
    res.status(501).json({ message: 'Vérification d\'email non implémentée' });
  },

  resendVerificationEmail: (req: Request, res: Response, next: NextFunction): void => {
    // TODO: Implémenter le renvoi d'email de vérification
    res.status(501).json({ message: 'Renvoi d\'email de vérification non implémenté' });
  },
};

export default authController;
