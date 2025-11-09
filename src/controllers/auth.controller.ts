import { Response, NextFunction, Request } from 'express';
import { TypedRequest } from '../types';
import authService from '../services/auth.service';
import { RegisterBody, LoginBody, IUserDataResponse, ILoginResponse, IAccessTokenResponse, ILogoutResponse } from '../types';
import { ValidationError } from '../utils/error';

const authController = {
  register: async (
    req: TypedRequest<RegisterBody>,
    res: Response<{ user: IUserDataResponse, message: string }>,
    _next: NextFunction,
  ): Promise<void> => {
    const result = await authService.register(req.body);
    res.status(201).json({ user: result.user, message: result.message });
    return;
  },
  
  login: async (
    req: TypedRequest<LoginBody>,
    res: Response<ILoginResponse>,
    _next: NextFunction,
  ): Promise<void> => {
    const { user, accessToken, expirationAccessToken, refreshToken, expirationRefreshToken, message } = await authService.login(req.body);

    const cookieOptions = {
      expires: expirationRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.status(200).json({
      user: user,
      accessToken: accessToken,
      expirationAccessToken: expirationAccessToken,
      message: message,
    });
    return;
  },

  refreshAccessToken: async (
    req: TypedRequest<Request>,
    res: Response<IAccessTokenResponse>,
    _next: NextFunction,
  ): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ValidationError('Refresh token non trouvé');
    }
    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json(result);
  },

  logout: async (
    req: TypedRequest<Request>,
    res: Response<ILogoutResponse>,
    _next: NextFunction,
  ): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.clearCookie('refreshToken');
      res.status(204).json({ message: 'Déconnexion réussie' });
      return;
    }
    
    const result = await authService.logout(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    });

    res.status(200).json({ message: result.message });
    return;
  },
};

export default authController;