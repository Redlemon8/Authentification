// Interface pour les réponses API
import { IUserDataResponse } from './user.interface';

export interface ILoginResponse {
  user: IUserDataResponse;
  accessToken: string;
  expirationAccessToken: Date;
  message: string;
}

export interface IAccessTokenResponse {
  accessToken: string;
  expirationAccessToken: Date;
  message: string;
}