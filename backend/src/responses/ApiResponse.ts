import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, message: string, data: any = null, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string, statusCode: number = 500): void {
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
}
