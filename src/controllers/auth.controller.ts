import { Request, Response } from 'express';
import authService from '../services/auth.service';

const authController = {
    register: async (req: Request, res: Response) => {
      const existingUser = await authService.findOne({ email: req.body.email });
      const user = await authService.register(req.body);
      res.status(201).json(user);
    }
};

export default authController;