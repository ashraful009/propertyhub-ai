import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getCustomerStats } from '../../repositories/customer/dashboard.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const getCustomerDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'CUSTOMER') {
      return ApiResponse.error(res, ERROR_MESSAGES.DASHBOARD.UNAUTHORIZED_ROLE, 403);
    }

    const data = await getCustomerStats(user.id);
    ApiResponse.success(res, RESPONSE_MESSAGES.DASHBOARD.FETCHED, data);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.DASHBOARD.FETCH_FAILED, 500);
  }
};
