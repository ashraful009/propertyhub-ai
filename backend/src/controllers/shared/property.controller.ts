import { Request, Response } from 'express';
import { findAllProperties, findPropertyById } from '../../repositories/shared/property.repository';
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

export const getPropertyById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await findPropertyById(id);
    if (!property) {
      ApiResponse.error(res, ERROR_MESSAGES.PROPERTY.NOT_FOUND, 404);
      return;
    }
    ApiResponse.success(res, RESPONSE_MESSAGES.PROPERTY.FETCHED, property);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};
