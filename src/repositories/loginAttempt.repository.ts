import { LoginAttempt } from '@prisma/client';
import { prisma } from '@config/database';

export interface CreateLoginAttemptData {
  email: string;
  ipAddress: string;
  userAgent?: string;
  success: boolean;
  failReason?: string;
}

export interface ILoginAttemptRepository {
  create(data: CreateLoginAttemptData): Promise<LoginAttempt>;
  getRecentFailedAttempts(email: string, minutes: number): Promise<number>;
  getRecentAttemptsByIp(ipAddress: string, minutes: number): Promise<number>;
  deleteOldAttempts(days: number): Promise<void>;
}

export class LoginAttemptRepository implements ILoginAttemptRepository {
  async create(data: CreateLoginAttemptData): Promise<LoginAttempt> {
    return prisma.loginAttempt.create({
      data,
    });
  }

  async getRecentFailedAttempts(email: string, minutes: number = 15): Promise<number> {
    const timeThreshold = new Date(Date.now() - minutes * 60 * 1000);
    
    return prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        createdAt: {
          gte: timeThreshold,
        },
      },
    });
  }

  async getRecentAttemptsByIp(ipAddress: string, minutes: number = 15): Promise<number> {
    const timeThreshold = new Date(Date.now() - minutes * 60 * 1000);
    
    return prisma.loginAttempt.count({
      where: {
        ipAddress,
        createdAt: {
          gte: timeThreshold,
        },
      },
    });
  }

  async deleteOldAttempts(days: number = 30): Promise<void> {
    const timeThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    await prisma.loginAttempt.deleteMany({
      where: {
        createdAt: {
          lt: timeThreshold,
        },
      },
    });
  }
}

export const loginAttemptRepository = new LoginAttemptRepository();
