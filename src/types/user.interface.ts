// Interface pour l'utilisateur
export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  accessToken: string;
  expirationAccessToken: Date;
  refreshToken: string;
  expirationRefreshToken: Date;
  isVerified: boolean;
  message: string;
}

