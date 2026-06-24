import { Request, Response } from 'express';
import { AuthService } from '../../services/shared/auth.service';
import pool from '../../database/db';
import { SecretUtil } from '../../utils/secret.util';
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

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return ApiResponse.error(res, 'Google credential token is required', 400);
    }

    const { user, accessToken, refreshToken } = await AuthService.googleLogin(credential);

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

// TEMPORARY: Seed Admin
export const seedAdminUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = 'admin@gmail.com';
    const password = await SecretUtil.hashPassword('12345678');
    const role = 'ADMIN';
    const name = 'Admin';

    const checkQuery = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await pool.query(checkQuery, [email]);
    
    if (rows.length > 0) {
        const updateQuery = `UPDATE users SET password = $1, role = $2 WHERE email = $3`;
        await pool.query(updateQuery, [password, role, email]);
        ApiResponse.success(res, 'Admin user updated successfully!', null, 200);
    } else {
        const insertQuery = `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`;
        await pool.query(insertQuery, [name, email, password, role]);
        ApiResponse.success(res, 'Admin user created successfully!', null, 201);
    }
  } catch (error: any) {
    ApiResponse.error(res, 'Error seeding admin: ' + error.message, 500);
  }
};
