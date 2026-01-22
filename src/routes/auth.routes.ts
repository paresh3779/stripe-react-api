import { Router } from 'express';
import { authController } from '@controllers/auth.controller';
import { validateDto } from '@middlewares/validation.middleware';
import { authenticate, authLimiter } from '@middlewares/index';
import { LoginDto, RegisterDto, RefreshTokenDto } from '@dto/auth';

const router = Router();

router.post(
  '/register',
  authLimiter,
  validateDto(RegisterDto),
  authController.register.bind(authController)
);

router.post(
  '/login',
  authLimiter,
  validateDto(LoginDto),
  authController.login.bind(authController)
);

router.post(
  '/refresh',
  validateDto(RefreshTokenDto),
  authController.refreshToken.bind(authController)
);

router.post(
  '/logout',
  validateDto(RefreshTokenDto),
  authController.logout.bind(authController)
);

router.get(
  '/me',
  authenticate,
  authController.me.bind(authController)
);

export default router;
