import { Response, NextFunction } from 'express';
import { TypedRequest } from '../types';
import authService from '../services/auth.service';
import { IUser, RegisterBody, LoginBody, RefreshAccessTokenBody, RefreshAccessTokenResponse } from '../types';

const authController = {
  register: async (
    req: TypedRequest<RegisterBody>,
    res: Response<IUser>,
    _next: NextFunction,
  ): Promise<void> => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
    return;
  },
  
  login: async (
    req: TypedRequest<LoginBody>,
    res: Response<IUser>,
    _next: NextFunction,
  ): Promise<void> => {
    const result = await authService.login(req.body);
    res.status(200).json(result);
    return;
  },

  refreshAccessToken: async (
    req: TypedRequest<RefreshAccessTokenBody>,
    res: Response<RefreshAccessTokenResponse>,
    _next: NextFunction,
  ): Promise<void> => {
    const result = await authService.refreshAccessToken(req.body);
    res.status(200).json(result);
  },
};

export default authController;