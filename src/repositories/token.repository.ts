import { RefreshToken } from '@prisma/client';
import { prisma } from '@config/database';
import { ITokenRepository, CreateTokenData } from './interfaces/ITokenRepository';

export class TokenRepository implements ITokenRepository {
  async create(data: CreateTokenData): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data,
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async deleteByToken(token: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async deleteExpired(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  async getUserTokenCount(userId: string): Promise<number> {
    return prisma.refreshToken.count({
      where: { userId },
    });
  }

  async deleteOldestUserToken(userId: string): Promise<void> {
    const oldestToken = await prisma.refreshToken.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    if (oldestToken) {
      await prisma.refreshToken.delete({
        where: { id: oldestToken.id },
      });
    }
  }
}

export const tokenRepository = new TokenRepository();
