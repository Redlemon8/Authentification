import { RegisterBody, LoginBody, IUserDataResponse, IAccessTokenResponse } from '../types';
import User from '../models/User';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/mailer';
import logger from '../utils/logger';
import { ValidationError } from '../utils/error';
import redisClient from '../db/coTokenData';

type IloginServiceResponse = {
  user: IUserDataResponse;
  accessToken: string;
  expirationAccessToken: Date;
  refreshToken: string;
  expirationRefreshToken: Date;
  message: string;
}

const authService = {
  register: async (userData: RegisterBody): Promise< { user: IUserDataResponse, message: string }> => {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      logger.error(`Tentative d'inscription avec email existant: ${userData.email}`);
      throw new ValidationError('Un utilisateur avec cet email existe déjà');
    }

    // Générer un token de confirmation
    const token = crypto.randomBytes(32).toString('hex');
    const expirationToken = new Date(Date.now() + 3600000); // 1 heure

    // Créer le nouvel utilisateur
    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      confirmationToken: token,
      confirmationTokenExpires: expirationToken,
      isVerified: false,
    });

    // Créer le lien de confirmation
    const registerLink = `${process.env.BASE_URL}:${process.env.PORT}/auth/confirm-email/${token}`;

    // Envoyer l'email de confirmation
    try {
      await sendEmail({
        to: userData.email,
        subject: 'Confirmez votre inscription',
        html: `
            <h1>Bienvenue ${userData.name} !</h1>
            <p>Merci de vous être inscrit. Cliquez sur le lien ci-dessous pour confirmer votre email :</p>
            <a href="${registerLink}">Confirmer mon email</a>
            <p>Ce lien expire dans 1 heure.</p>
        `,
      });
      logger.info(`Email de confirmation envoyé à ${userData.email}`);
    } catch (error) {
      logger.error(`Erreur lors de l'envoi de l'email à ${userData.email}:`, error);
      throw new ValidationError('Erreur lors de l\'envoi de l\'email');
    }

    // Retourner les infos de l'utilisateur (sans mot de passe ni token)
    return {
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        isVerified: newUser.isVerified,
      },
      message: 'Un email de confirmation a été envoyé à votre adresse email',
    };
  },

  confirmEmail: async (token: string): Promise<{ message: string }> => {
    const user = await User.findOne({
      confirmationToken: token,
      confirmationTokenExpires: { $gt: new Date() }, // Token non expiré
    });
    if (!user) {
      logger.error(`Tentative de confirmation avec token invalide ou expiré: ${token}`);
      throw new ValidationError('Token de confirmation invalide ou expiré');
    }

    // Marquer l'utilisateur comme vérifié
    user.isVerified = true;
    user.confirmationToken = ''; // Supprimer le token utilisé
    user.confirmationTokenExpires = new Date(); // Supprimer la date d'expiration
    await user.save();

    logger.info(`Email confirmé avec succès pour: ${user.email}`);
    return { message: 'Email confirmé avec succès' };
  },

  login: async (userData: LoginBody): Promise<IloginServiceResponse> => {
    const user = await User.findOne({ email: userData.email }).select('+password');
    if (!user) {
      logger.error(`Tentative de connexion avec email invalide: ${userData.email}`);
      throw new ValidationError('Email ou mot de passe invalide');
    }

    // Vérifier si le mot de passe est correct
    const isPasswordValid = await user.checkPassword(userData.password);
    
    if (!isPasswordValid) {
      logger.error(`Tentative de connexion avec mot de passe invalide: ${userData.email}`);
      throw new ValidationError('Email ou mot de passe invalide');
    }
    
    // Générer un token JWT
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET ?? '', { expiresIn: '15 minutes' });
    const expirationAccessToken = new Date(Date.now() + 15 * 60 * 1000);

    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET ?? '', { expiresIn: '7 days' });
    const expirationRefreshToken = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    logger.info(`Connexion réussie pour: ${user.email}`);
    

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
      accessToken: accessToken,
      expirationAccessToken: expirationAccessToken,
      refreshToken: refreshToken,
      expirationRefreshToken: expirationRefreshToken,
      message: 'Connexion réussie',
    };
  },
  
  refreshAccessToken: async (refreshToken: string): Promise<IAccessTokenResponse> => {

    const isBlacklisted = await redisClient.client.get(refreshToken);
    if (isBlacklisted) {
      logger.error(`Refresh token blacklisté: ${refreshToken}`);
      throw new ValidationError('Refresh token blacklisté, veuillez vous reconnecter');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET ?? '') as { userId: string };
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      logger.error(`Utilisateur non trouvé avec refresh token: ${refreshToken}`);
      throw new ValidationError('Utilisateur non trouvé');
    }
    logger.info(`Refresh token réussi pour: ${user.email}`);

    // Générer un nouveau token d'accès
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET ?? '', { expiresIn: '15 minutes' });
    const expirationAccessToken = new Date(Date.now() + 15 * 60 * 1000);
    return {  
      accessToken: accessToken,
      expirationAccessToken: expirationAccessToken,
      message: 'Refresh token réussi',
    };
  },

  logout: async (refreshToken: string): Promise<{ message: string }> => {

    const decoded = jwt.decode(refreshToken) as { exp?: number };

    if (!decoded?.exp) {
      logger.warn('Tentative de déconnexion avec un token malformé ou sans expiration');
      throw new ValidationError('Token de refresh invalide');
    }

    const expirationTimestamp = decoded.exp;
    const nowTimestamp = Math.floor(Date.now() / 1000);
    const timeLeft = expirationTimestamp - nowTimestamp;

    if (timeLeft > 0) {
      await redisClient.client.set(refreshToken, 'blacklisted', {
        EX: timeLeft,
      });
      logger.info(`Refresh token blacklisté jusqu'à expiration naturelle: ${refreshToken}`);
    }
    logger.info(`Refresh token déconnecté: ${refreshToken}`);
    return { message: 'Déconnexion réussie' };
  },
};

export default authService;
