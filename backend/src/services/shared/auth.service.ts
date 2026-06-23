import { OAuth2Client } from 'google-auth-library';
import { findUserByEmail, createUser } from '../../repositories/shared/user.repository';
import { SecretUtil } from '../../utils/secret.util';
import { AppError } from '../../errors/AppError';
import { ERROR_MESSAGES } from '../../errors/errorMessages';

export class AuthService {
  static async register(name: string, email: string, password: string, role: string) {
    const userExists = await findUserByEmail(email);
    if (userExists) {
      throw new AppError(ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS, 400);
    }

    const hashPassword = await SecretUtil.hashPassword(password);

    const newUser = await createUser({
      name,
      email,
      password: hashPassword,
      role: (role || 'CUSTOMER') as any,
    });

    return newUser;
  }

  static async login(email: string, password: string) {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, 400);
    }

    const isMatch = await SecretUtil.comparePassword(password, user.password as string);
    if (!isMatch) {
      throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, 400);
    }

    const accessToken = SecretUtil.generateToken(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET as string,
      '7d'
    );

    const refreshToken = SecretUtil.generateToken(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      '7d'
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  static async googleLogin(credential: string) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      throw new AppError('Invalid Google token', 400);
    }
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new AppError('Invalid Google payload', 400);
    }

    const { email, name } = payload;
    let user = await findUserByEmail(email);

    if (!user) {
      // Create user automatically
      const randomPassword = Math.random().toString(36).slice(-10) + 'A1!';
      const hashPassword = await SecretUtil.hashPassword(randomPassword);
      user = await createUser({
        name: name || 'Google User',
        email,
        password: hashPassword,
        role: 'CUSTOMER',
      });
    }

    const accessToken = SecretUtil.generateToken(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET as string,
      '7d'
    );

    const refreshToken = SecretUtil.generateToken(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      '7d'
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}
