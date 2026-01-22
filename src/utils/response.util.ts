import { Response } from 'express';
import { ApiResponse } from '../types/common.types';

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: Record<string, string[]>
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message?: string): Response {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static badRequest(res: Response, message: string, errors?: Record<string, string[]>): Response {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }

  static conflict(res: Response, message: string): Response {
    return this.error(res, message, 409);
  }

  static validationError(res: Response, errors: Record<string, string[]>): Response {
    return this.error(res, 'Validation failed', 422, errors);
  }
}
