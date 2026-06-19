import { Request, Response } from 'express';
import { AuthService } from '../../services/shared/auth.service';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return ApiResponse.error(res, ERROR_MESSAGES.AUTH.ALL_FIELDS_REQUIRED, 400);
    }

    const newUser = await AuthService.register(name, email, password, role);
    ApiResponse.success(res, RESPONSE_MESSAGES.AUTH.REGISTER_SUCCESS, newUser, 201);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    ApiResponse.error(res, error.message || ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, statusCode);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, ERROR_MESSAGES.AUTH.EMAIL_PASSWORD_REQUIRED, 400);
    }

    const { user, accessToken, refreshToken } = await AuthService.login(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    ApiResponse.success(res, RESPONSE_MESSAGES.AUTH.LOGIN_SUCCESS, { accessToken, user });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    ApiResponse.error(res, error.message || ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, statusCode);
  }
};
