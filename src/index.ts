import express, { Application } from 'express';
import https from 'https';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import 'dotenv/config';
import cors from 'cors';
import router from './router';
import connectDB from './db/database';
import { errorHandler, notFoundHandler } from './middlewares/handleError';
import redisClient from './db/coTokenData';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);
app.use(errorHandler);
app.use(notFoundHandler);

// Connexion à Redis
void redisClient.connectRedis();

// Connexion à MongoDB
void connectDB();

// Configuration HTTPS
const httpsOptions = {
  key: fs.readFileSync('./localhost+2-key.pem'),
  cert: fs.readFileSync('./localhost+2.pem'),
};

// Démarrer le serveur HTTPS
const server = https.createServer(httpsOptions, app);

server.listen(process.env.PORT ?? 3000, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Serveur HTTPS démarré sur ${process.env.BASE_URL}:${process.env.PORT}`);
  // eslint-disable-next-line no-console
  console.log(`📱 URL: ${process.env.BASE_URL}:${process.env.PORT}`);
});

// Gestion des erreurs serveur si le port est occupé
server.on('error', (err: any) => {
  if (err?.code === 'EADDRINUSE') {
    // eslint-disable-next-line no-console
    console.log(`⚠️  Port ${process.env.PORT ?? 3000} occupé, tentative sur le port ${process.env.PORT ?? 3000 + 1}`);
    server.listen(process.env.PORT ?? 3000 + 1, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Serveur HTTPS démarré sur ${process.env.BASE_URL}:${process.env.PORT ?? 3000 + 1}`);
      // eslint-disable-next-line no-console
      console.log(`📱 URL: ${process.env.BASE_URL}:${process.env.PORT ?? 3000 + 1}`);
    });
  } else {
    // eslint-disable-next-line no-console
    console.error('❌ Erreur du serveur:', err);
    // eslint-disable-next-line no-console
    server.close();
  }
});


export default app;
