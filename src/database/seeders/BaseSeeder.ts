import { PrismaClient } from '@prisma/client';
import { logger } from '@config/logger';

export abstract class BaseSeeder {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  abstract run(): Promise<void>;

  protected log(message: string): void {
    logger.info(`[${this.constructor.name}] ${message}`);
  }

  protected logError(message: string, error?: any): void {
    logger.error(`[${this.constructor.name}] ${message}`, error);
  }
}
