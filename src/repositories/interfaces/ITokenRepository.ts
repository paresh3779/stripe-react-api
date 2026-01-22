import { RefreshToken } from '@prisma/client';

export interface CreateTokenData {
  token: string;
  userId: string;
  expiresAt: Date;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ITokenRepository {
  create(data: CreateTokenData): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
  getUserTokenCount(userId: string): Promise<number>;
  deleteOldestUserToken(userId: string): Promise<void>;
}
