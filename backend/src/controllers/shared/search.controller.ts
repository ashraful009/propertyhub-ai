import { Request, Response } from 'express';
import { findPropertiesByFilter } from '../../repositories/shared/search.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const searchProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = req.query;
    const properties = await findPropertiesByFilter(filters);
    ApiResponse.success(res, RESPONSE_MESSAGES.SEARCH.FETCHED, properties);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};