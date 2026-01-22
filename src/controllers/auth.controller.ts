import { Request, Response, NextFunction } from 'express';
import { authService } from '@services/auth.service';
import { ResponseUtil } from '@utils/response.util';
import { RequestUtil } from '@utils/request.util';
import { logger } from '@config/logger';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ipAddress = RequestUtil.getIpAddress(req);
      const userAgent = RequestUtil.getUserAgent(req);
      const deviceInfo = RequestUtil.getDeviceInfo(req);
      
      const result = await authService.register(req.body, ipAddress, userAgent, deviceInfo);
      logger.info(`User registered: ${result.user.email}`);
      ResponseUtil.created(res, result, 'Registration successful');
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ipAddress = RequestUtil.getIpAddress(req);
      const userAgent = RequestUtil.getUserAgent(req);
      const deviceInfo = RequestUtil.getDeviceInfo(req);
      
      const result = await authService.login(req.body, ipAddress, userAgent, deviceInfo);
      logger.info(`User logged in: ${result.user.email}`);
      ResponseUtil.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const ipAddress = RequestUtil.getIpAddress(req);
      const userAgent = RequestUtil.getUserAgent(req);
      const deviceInfo = RequestUtil.getDeviceInfo(req);
      
      const tokens = await authService.refreshToken(refreshToken, ipAddress, userAgent, deviceInfo);
      logger.info('Token refreshed successfully');
      ResponseUtil.success(res, tokens, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      logger.info('User logged out');
      ResponseUtil.success(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      ResponseUtil.success(res, user);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
