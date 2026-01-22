import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '@utils/jwt.util';
import { ResponseUtil } from '@utils/response.util';
import { prisma } from '@config/database';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ResponseUtil.unauthorized(res, 'No token provided');
      return;
    }

    const token = authHeader.substring(7);
    const payload = JwtUtil.verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.isActive) {
      ResponseUtil.unauthorized(res, 'User not found or inactive');
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    req.user = userWithoutPassword as any;
    req.userId = user.id;
    next();
  } catch (error) {
    ResponseUtil.unauthorized(res, 'Invalid or expired token');
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseUtil.unauthorized(res);
      return;
    }

    if (roles.length && !roles.includes(req.user.role)) {
      ResponseUtil.forbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };
};
