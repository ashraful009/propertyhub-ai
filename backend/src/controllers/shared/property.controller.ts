import { Request, Response } from 'express';
import { findAllProperties } from '../../repositories/shared/property.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const getAllProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const properties = await findAllProperties();
    ApiResponse.success(res, RESPONSE_MESSAGES.PROPERTY.FETCHED, properties);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};
