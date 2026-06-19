import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { ApiResponse } from '../../responses/ApiResponse';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const getUserProfile = (req: AuthRequest, res: Response) => {
  ApiResponse.success(res, RESPONSE_MESSAGES.USER.PROFILE_FETCHED, req.user);
};

export const getVendorDashboard = (req: AuthRequest, res: Response) => {
  ApiResponse.success(res, RESPONSE_MESSAGES.USER.VENDOR_DASHBOARD, req.user);
};

export const getAdminDashboard = (req: AuthRequest, res: Response) => {
  ApiResponse.success(res, RESPONSE_MESSAGES.USER.ADMIN_DASHBOARD, req.user);
};
