import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { insertProperty, updatePropertyById, deletePropertyById } from '../../repositories/vendor/property.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendor_id = req.user?.id;

    if (!vendor_id) {
      return ApiResponse.error(res, ERROR_MESSAGES.COMMON.UNAUTHORIZED, 401);
    }

    const files = req.files as Express.Multer.File[];
    const images = files ? files.map(file => file.path) : [];

    const propertyData = {
      ...req.body,
      images,
      vendor_id,
    };

    const newProperty = await insertProperty(propertyData);
    ApiResponse.success(res, RESPONSE_MESSAGES.PROPERTY.CREATED, newProperty, 201);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return ApiResponse.error(res, ERROR_MESSAGES.COMMON.UNAUTHORIZED, 401);
    }

    const updatedProperty = await updatePropertyById(id as string, userId, userRole, req.body);

    if (!updatedProperty) {
      return ApiResponse.error(res, ERROR_MESSAGES.PROPERTY.NOT_FOUND_OR_NO_UPDATE_PERMISSION, 404);
    }

    ApiResponse.success(res, RESPONSE_MESSAGES.PROPERTY.UPDATED, updatedProperty);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return ApiResponse.error(res, ERROR_MESSAGES.COMMON.UNAUTHORIZED, 401);
    }

    const isDeleted = await deletePropertyById(id as string, userId, userRole);

    if (!isDeleted) {
      return ApiResponse.error(res, ERROR_MESSAGES.PROPERTY.NOT_FOUND_OR_NO_DELETE_PERMISSION, 404);
    }

    ApiResponse.success(res, RESPONSE_MESSAGES.PROPERTY.DELETED);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};
