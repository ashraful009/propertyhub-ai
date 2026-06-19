import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getAdminStats } from '../../repositories/admin/dashboard.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const getAdminDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'ADMIN') {
      return ApiResponse.error(res, ERROR_MESSAGES.DASHBOARD.UNAUTHORIZED_ROLE, 403);
    }

    const data = await getAdminStats();
    ApiResponse.success(res, RESPONSE_MESSAGES.DASHBOARD.FETCHED, data);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.DASHBOARD.FETCH_FAILED, 500);
  }
};
