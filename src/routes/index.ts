import { Router } from 'express';
import authRoutes from './auth.routes';
import { env } from '@config/env';

const router = Router();

router.use(`${env.API_PREFIX}/auth`, authRoutes);

router.get(`${env.API_PREFIX}/health`, (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
