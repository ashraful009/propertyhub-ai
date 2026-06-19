import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { insertVendorApplication } from '../../repositories/customer/vendor.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const submitApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId || req.user?.role !== 'CUSTOMER') {
      return ApiResponse.error(res, ERROR_MESSAGES.VENDOR.CUSTOMER_ONLY_APPLY, 403);
    }

    const { company_name, location, full_address, company_mail, phone, document_url } = req.body;

    const applicationData = {
      user_id: userId,
      company_name,
      location,
      full_address,
      company_mail,
      phone,
      document_url,
    };

    const newApplication = await insertVendorApplication(applicationData);
    ApiResponse.success(res, RESPONSE_MESSAGES.VENDOR.APPLICATION_SUBMITTED, newApplication, 201);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};
