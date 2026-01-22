import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError as ClassValidatorError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ResponseUtil } from '@utils/response.util';

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const formattedErrors = formatValidationErrors(errors);
      ResponseUtil.validationError(res, formattedErrors);
      return;
    }

    req.body = dtoInstance;
    next();
  };
}

function formatValidationErrors(errors: ClassValidatorError[]): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  errors.forEach((error) => {
    if (error.constraints) {
      formatted[error.property] = Object.values(error.constraints);
    }
  });

  return formatted;
}
