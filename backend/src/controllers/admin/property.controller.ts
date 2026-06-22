import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getPendingProperties, updatePropertyApproval } from '../../repositories/admin/property.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';

export const getPendingPropertyRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const properties = await getPendingProperties();
    ApiResponse.success(res, 'Pending properties fetched successfully', properties);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const reviewPropertyRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'

    if (!['APPROVED', 'REJECTED'].includes(status)) {
       ApiResponse.error(res, 'Invalid review status', 400);
       return;
    }

    const isApproved = status === 'APPROVED';
    await updatePropertyApproval(id as string, isApproved);
    
    ApiResponse.success(res, `Property has been ${status.toLowerCase()} successfully.`);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};
