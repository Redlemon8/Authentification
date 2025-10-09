//src/middlewares/handleError.ts
import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/error';

function cw(controller: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

// * Middleware de gestion d'erreurs
function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
    // Log l'erreur pour le débogage (en développement)
    console.error('❌ Erreur capturée:', err);

    // * Si c'est une de nos erreurs personnalisées 404 ou 400 (schémas)
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.message,
            // * Si l'erreur vient du schéma on ajoute les détails au message 
            ...(err instanceof ValidationError && { details: err.details })
        });
        return;
    }

    // * Gestion des erreurs MongoDB (duplication d'email par exemple)
    if (err.code === 11000 || err.name === 'MongoServerError') {
        res.status(409).json({
            error: 'Cette ressource existe déjà (email en double)',
        });
        return;
    }

    // * Erreurs de validation Mongoose
    if (err.name === 'ValidationError') {
        res.status(400).json({
            error: 'Erreur de validation',
            details: Object.values(err.errors).map((e: any) => e.message)
        });
        return;
    }

    // * Erreurs de cast MongoDB (ID invalide)
    if (err.name === 'CastError') {
        res.status(400).json({
            error: 'ID invalide'
        });
        return;
    }

    // * Pour les erreurs non gérées
    res.status(500).json({ 
        error: "Une erreur inattendue est survenue, merci de réessayer plus tard.",
        // En développement, on peut ajouter plus de détails
        ...(process.env.NODE_ENV === 'development' && { 
            details: err.message,
            stack: err.stack 
        })
    });
}

// * Middleware pour les routes non trouvées
function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        error: "Route non trouvée",
        path: req.originalUrl
    });
}

export { cw, errorHandler, notFoundHandler };