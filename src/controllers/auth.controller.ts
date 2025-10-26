import { Response, NextFunction } from 'express';
import { TypedRequest } from '../types/express';
import authService from '../services/auth.service';
import { IUser, RegisterBody, LoginBody } from '../interfaces/user.interface';

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
};

export default authController;