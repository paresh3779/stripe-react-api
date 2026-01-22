import { createApp } from './app';
import { env, isDevelopment } from '@config/env';
import { connectDatabase, disconnectDatabase } from '@config/database';
import { logger } from '@config/logger';

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🚀 Server is running!                   ║
║                                           ║
║   Environment: ${env.NODE_ENV.padEnd(27)}║
║   Port: ${env.PORT.toString().padEnd(34)}║
║   API: http://localhost:${env.PORT}${env.API_PREFIX.padEnd(12)}║
║                                           ║
╚═══════════════════════════════════════════╝
      `);

      if (isDevelopment) {
        logger.info('📝 API Documentation: http://localhost:' + env.PORT + env.API_PREFIX);
        logger.info('🔍 Health Check: http://localhost:' + env.PORT + env.API_PREFIX + '/health');
      }
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        await disconnectDatabase();

        logger.info('✅ Graceful shutdown completed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason: any) => {
      logger.error('Unhandled Rejection:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
