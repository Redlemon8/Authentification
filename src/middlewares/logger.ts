//src/middlewares/logger.ts
import logger from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

// Middleware pour logger les requêtes HTTP
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Capturer le temps de début
  const start = Date.now();

  // Log de la requête entrante
  logger.http(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.method !== 'GET' ? (req as any).body : undefined,
  });

  // Intercepter la réponse pour logger le temps de traitement
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    
    // Déterminer le niveau de log selon le code de statut
    let logLevel = 'info';
    if (status >= 400 && status < 500) {
      logLevel = 'warn';
    } else if (status >= 500) {
      logLevel = 'error';
    }
      
    logger.log(logLevel, `${req.method} ${req.url} - ${status} - ${duration}ms`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      duration,
      statusCode: status,
    });
  });

  next();
}; 