//src/middlewares/handleError.ts
import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/error';
import logger from '../utils/logger';
import { TypedRequest } from '../types';

function cw<TBody = unknown, TParams = Record<string, never>, TQuery = unknown>(
  controller: (req: TypedRequest<TBody, TParams, TQuery>, res: Response, next: NextFunction) => Promise<void> | void,
) {
  return (req: TypedRequest<TBody, TParams, TQuery>, res: Response, next: NextFunction): void => {
    try {
      const result = controller(req, res, next);
      if (result instanceof Promise) {
        result.catch(error => next(error));
      }
    } catch (error) {
      next(error);
    }
  };
}

// * Middleware de gestion d'erreurs
function errorHandler(err: Error | AppError, req: Request, res: Response): void {
  // Log de l'erreur avec Winston
  logger.error(`Erreur ${(err as AppError).statusCode || 500}: ${err.message}`, {
    url: req.url,
    method: req.method,
    ip: (req as any).ip,
    userAgent: (req as any).get('User-Agent'),
    stack: err.stack,
  });

  // * Si c'est une de nos erreurs personnalisées 404 ou 400 (schémas)
  if (err instanceof AppError) {
    logger.error('Erreur personnalisée', {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
    });
    res.status(err.statusCode).json({
      error: err.message,
      // * Si l'erreur vient du schéma on ajoute les détails au message 
      ...(err instanceof ValidationError && { details: err.details }),
    });
    return;
  }

  // * Gestion des erreurs MongoDB (duplication d'email par exemple)
  if ((err as any).code === 11000 || err.name === 'MongoServerError') {
    logger.error('Erreur MongoDB', {
      name: err.name,
      message: err.message,
      code: (err as any).code,
    });
    res.status(409).json({
      error: 'Cette ressource existe déjà (email en double)',
    });
    return;
  }

  // * Erreurs de validation Mongoose
  if (err.name === 'ValidationError') {
    logger.error('Erreur de validation', {
      name: err.name,
      message: err.message,
      errors: (err as any).errors,
    });
    res.status(400).json({
      error: 'Erreur de validation',
      details: Object.values((err as any).errors).map((e: any) => e.message),
    });
    return;
  }

  // * Erreurs de cast MongoDB (ID invalide)
  if (err.name === 'CastError') {
    logger.error('Erreur de cast MongoDB', {
      name: err.name,
      message: err.message,
      errors: (err as any).errors,
    });
    res.status(400).json({
      error: 'ID invalide',
    });
    return;
  }

  // * Pour les erreurs non gérées
  res.status(500).json({
    error: 'Une erreur inattendue est survenue, merci de réessayer plus tard.',
    // En développement, on peut ajouter plus de détails
    ...(process.env.NODE_ENV === 'development' && { 
      details: err.message,
      stack: err.stack,
    }),
  });
}

// * Middleware pour les routes non trouvées
function notFoundHandler(req: TypedRequest<unknown, unknown, unknown>, res: Response): void {
  // Log de la route non trouvée avec Winston
  logger.warn(`Route non trouvée: ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl,
  });
}

export { cw, errorHandler, notFoundHandler };