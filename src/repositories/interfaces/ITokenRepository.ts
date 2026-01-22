import { RefreshToken } from '@prisma/client';

export interface CreateTokenData {
  token: string;
  userId: string;
  expiresAt: Date;
}

export interface ITokenRepository {
  create(data: CreateTokenData): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
}
