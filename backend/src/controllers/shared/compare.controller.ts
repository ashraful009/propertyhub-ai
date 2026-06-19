import { Request, Response } from 'express';
import { findPropertiesById } from '../../repositories/shared/compare.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const compareProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.query;

    if (!ids || typeof ids !== 'string') {
      return ApiResponse.error(res, ERROR_MESSAGES.COMPARE.INVALID_IDS, 400);
    }

    const idArray = ids.split(',');
    const properties = await findPropertiesById(idArray);
    ApiResponse.success(res, RESPONSE_MESSAGES.COMPARE.FETCHED, properties);
  } catch (err) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};