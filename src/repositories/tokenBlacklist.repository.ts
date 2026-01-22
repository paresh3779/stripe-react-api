import { TokenBlacklist } from '@prisma/client';
import { prisma } from '@config/database';

export interface CreateBlacklistData {
  token: string;
  userId?: string;
  reason?: string;
  expiresAt: Date;
}

export interface ITokenBlacklistRepository {
  create(data: CreateBlacklistData): Promise<TokenBlacklist>;
  findByToken(token: string): Promise<TokenBlacklist | null>;
  isTokenBlacklisted(token: string): Promise<boolean>;
  deleteExpired(): Promise<void>;
  blacklistUserTokens(userId: string, reason: string): Promise<void>;
}

export class TokenBlacklistRepository implements ITokenBlacklistRepository {
  async create(data: CreateBlacklistData): Promise<TokenBlacklist> {
    return prisma.tokenBlacklist.create({
      data,
    });
  }

  async findByToken(token: string): Promise<TokenBlacklist | null> {
    return prisma.tokenBlacklist.findUnique({
      where: { token },
    });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklisted = await this.findByToken(token);
    if (!blacklisted) return false;
    
    if (blacklisted.expiresAt < new Date()) {
      await prisma.tokenBlacklist.delete({ where: { id: blacklisted.id } });
      return false;
    }
    
    return true;
  }

  async deleteExpired(): Promise<void> {
    await prisma.tokenBlacklist.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  async blacklistUserTokens(userId: string, reason: string): Promise<void> {
    const userTokens = await prisma.refreshToken.findMany({
      where: { userId },
      select: { token: true, expiresAt: true },
    });

    if (userTokens.length > 0) {
      await prisma.tokenBlacklist.createMany({
        data: userTokens.map(t => ({
          token: t.token,
          userId,
          reason,
          expiresAt: t.expiresAt,
        })),
      });
    }
  }
}

export const tokenBlacklistRepository = new TokenBlacklistRepository();
