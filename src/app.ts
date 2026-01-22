import 'reflect-metadata';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import { corsOptions } from '@config/cors';
import { errorHandler, notFoundHandler } from '@middlewares/error.middleware';
import { sanitizeInput } from '@middlewares/sanitize.middleware';
import { generalLimiter } from '@middlewares/rateLimit.middleware';
import routes from './routes';
import { logger } from '@config/logger';
import { isDevelopment } from '@config/env';

export const createApp = (): Express => {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // CORS
  app.use(cors(corsOptions));

  // HTTP parameter pollution protection
  app.use(hpp());

  // Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  if (isDevelopment) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    }));
  }

  // Input sanitization
  app.use(sanitizeInput);

  // Rate limiting
  app.use(generalLimiter);

  // Routes
  app.use(routes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};
