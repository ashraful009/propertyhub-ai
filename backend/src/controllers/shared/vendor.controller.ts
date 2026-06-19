import { Response, Request } from 'express';
import { getVendorPolicyFromDb } from '../../repositories/shared/vendor.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const getVendorPolicy = async (req: Request, res: Response): Promise<void> => {
  try {
    const policy = await getVendorPolicyFromDb();
    ApiResponse.success(res, RESPONSE_MESSAGES.VENDOR.POLICY_FETCHED, policy);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};
