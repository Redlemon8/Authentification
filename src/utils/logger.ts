import winston from 'winston';

// Configuration des niveaux de log personnalisés
const levels = {
  error: 0,   // Erreurs critiques
  warn: 1,    // Avertissements
  info: 2,    // Informations générales
  http: 3,    // Requêtes HTTP
  debug: 4    // Informations de débogage
};

// Configuration des couleurs pour chaque niveau
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Ajouter les couleurs à Winston
winston.addColors(colors);

// Format personnalisé pour les logs
const format = winston.format.combine(
  // Ajouter un timestamp à chaque log
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Ajouter des couleurs
  winston.format.colorize({ all: true }),
  // Format de sortie personnalisé
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Configuration du logger
const logger = winston.createLogger({
  // Niveau de log par défaut (peut être configuré via NODE_ENV)
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  // Niveaux de log définis
  levels,
  // Format des logs
  format,
  // Transports (où les logs sont envoyés)
  transports: [
    // Transport pour la console
    new winston.transports.Console(),
    // Transport pour les erreurs (fichier séparé)
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    // Transport pour tous les logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// Créer le dossier logs s'il n'existe pas
import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export default logger; 