import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getAllPolicies, insertPolicy, updatePolicyById, deletePolicyById } from '../../repositories/shared/policy.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const getPolicies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    const policies = await getAllPolicies(type as string | undefined);
    ApiResponse.success(res, RESPONSE_MESSAGES.POLICY.FETCHED, policies);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const createPolicy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { policy_type, title, content, is_mandatory } = req.body;

    if (!policy_type || !title || !content) {
      return ApiResponse.error(res, ERROR_MESSAGES.COMMON.MISSING_REQUIRED_FIELDS, 400);
    }

    const newPolicy = await insertPolicy(policy_type, title, content, is_mandatory || false);
    ApiResponse.success(res, RESPONSE_MESSAGES.POLICY.CREATED, newPolicy, 201);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const updatePolicy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return ApiResponse.error(res, ERROR_MESSAGES.COMMON.MISSING_REQUIRED_FIELDS, 400);
    }

    const updated = await updatePolicyById(id as string, title, content);

    if (!updated) {
      return ApiResponse.error(res, ERROR_MESSAGES.POLICY.NOT_FOUND_OR_MANDATORY, 404);
    }

    ApiResponse.success(res, RESPONSE_MESSAGES.POLICY.UPDATED, updated);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const deletePolicy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await deletePolicyById(id as string);

    if (!deleted) {
      return ApiResponse.error(res, ERROR_MESSAGES.POLICY.NOT_FOUND_OR_MANDATORY, 404);
    }

    ApiResponse.success(res, RESPONSE_MESSAGES.POLICY.DELETED);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};
