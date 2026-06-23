import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getVendorStats } from '../../repositories/vendor/dashboard.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const getVendorDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'VENDOR') {
      return ApiResponse.error(res, ERROR_MESSAGES.DASHBOARD.UNAUTHORIZED_ROLE, 403);
    }

    const data = await getVendorStats(user.id);
    ApiResponse.success(res, RESPONSE_MESSAGES.DASHBOARD.FETCHED, data);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.DASHBOARD.FETCH_FAILED, 500);
  }
};
export const sendReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params; 
    console.log(`[Reminder Service] Sending reminder to customer ${id}`);
    ApiResponse.success(res, 'Reminder sent successfully');
  } catch (error) {
    ApiResponse.error(res, 'Failed to send reminder', 500);
  }
};
