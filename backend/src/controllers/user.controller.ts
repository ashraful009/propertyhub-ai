import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getUserProfile = (req: AuthRequest, res: Response) => {
  res.status(200).json({ message: 'Welcome to your profile', user: req.user });
};

export const getVendorDashboard = (req: AuthRequest, res: Response) => {
  res.status(200).json({ message: 'Welcome to vendor Dashboard', user: req.user });
};

export const getAdminDashboard = (req: AuthRequest, res: Response) => {
  res.status(200).json({ message: 'Welcome to admin Dashboard', user: req.user });
};
