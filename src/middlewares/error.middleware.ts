import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '@utils/error.util';
import { ResponseUtil } from '@utils/response.util';
import { logger } from '@config/logger';
import { isDevelopment } from '@config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  if (err instanceof ValidationError) {
    ResponseUtil.validationError(res, err.errors);
    return;
  }

  if (err instanceof AppError) {
    ResponseUtil.error(res, err.message, err.statusCode);
    return;
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    handlePrismaError(err, res);
    return;
  }

  const message = isDevelopment ? err.message : 'Internal server error';
  const statusCode = 500;

  ResponseUtil.error(res, message, statusCode);
};

function handlePrismaError(err: any, res: Response): void {
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    ResponseUtil.conflict(res, `${field} already exists`);
    return;
  }

  if (err.code === 'P2025') {
    ResponseUtil.notFound(res, 'Record not found');
    return;
  }

  ResponseUtil.error(res, 'Database error', 500);
}

export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseUtil.notFound(res, `Route ${req.originalUrl} not found`);
};
