import { IUser, RegisterBody } from '../interfaces/user.interface';
import User from '../models/User';
import crypto from 'crypto';
import argon2 from 'argon2';
import sendEmail from '../utils/mailer';
import logger from '../utils/logger';
import { ValidationError } from '../utils/error';

const authService = {
  register: async (userData: RegisterBody): Promise<IUser & { message: string }> => {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      logger.error(`Tentative d'inscription avec email existant: ${userData.email}`);
      throw new ValidationError('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe avec argon2
    const hashedPassword = await argon2.hash(userData.password);

    // Générer un token de confirmation
    const token = crypto.randomBytes(32).toString('hex');
    const expirationToken = new Date(Date.now() + 3600000); // 1 heure

    // Créer le nouvel utilisateur
    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
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
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      password: '', // Masqué pour la sécurité
      token: newUser.confirmationToken ?? '',
      expirationToken: newUser.confirmationTokenExpires ?? new Date(),
      isVerified: newUser.isVerified,
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
};

export default authService;