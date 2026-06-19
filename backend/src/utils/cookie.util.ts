import { Response } from 'express';

export class CookieUtil {
  static setTokenCookie(res: Response, token: string): void {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  static clearTokenCookie(res: Response): void {
    res.clearCookie('token');
  }
}
