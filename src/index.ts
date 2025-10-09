import express, { Application } from 'express';
import 'dotenv/config';
import cors from 'cors';
import router from './router';
import connectDB from './db/database';
import { errorHandler, notFoundHandler } from './middlewares/handleError';
const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler);
app.use(notFoundHandler);

// Connexion à MongoDB
connectDB();

// Fonction pour démarrer le serveur et gérer les erreurs
const startServer = (port: number) => {
  const server = app.listen(port, (): void => {
    console.log(`🚀 Serveur démarré sur le port ${port}`);
    console.log(`📱 URL: http://localhost:${port}`);
  });

  // Gestion des erreurs serveur si le port est occupé
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} occupé, tentative sur le port ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('❌ Erreur du serveur:', err);
    }
  });
};

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
startServer(PORT);

export default app;
