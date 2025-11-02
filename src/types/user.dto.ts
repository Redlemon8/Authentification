// DTOs (Data Transfer Objects) pour les requêtes API
export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RefreshAccessTokenBody {
  refreshToken: string;
}

export interface RefreshAccessTokenResponse {
  accessToken: string;
  expirationAccessToken: Date;
  refreshToken: string;
  expirationRefreshToken: Date;
}

