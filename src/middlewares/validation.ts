//src/middlewares/validation.js
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/error';
import { ObjectSchema } from 'joi';

// * fonction de validation des schéma
function validate(schema: ObjectSchema): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { error, value } = schema.validate(req.body, { 
        // * Continue la validation (même en cas d'erreurs) et retourne toutes les erreurs détéctées
        abortEarly: false,
        // * Supprime les champs non définis dans le schéma
        stripUnknown: true,
      });
      
      // * Si une erreur de schéma est rencontré on map sur le tableau de détails
      if (error) {
        const details = error.details.map((err) => ({
          message: err.message,
          path: err.path.join('.'),
        }));
        
        throw new ValidationError('Données invalides', details.map(d => d.message));
      }
      
      // * Remplacer le body par les données validées
      (req as any).body = value;
      next();
    } catch (err: unknown) {
      next(err);
    }
  };
}

export { validate };