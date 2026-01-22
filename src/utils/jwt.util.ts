import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '@config/env';
import { TokenPayload } from '../types/common.types';

export class JwtUtil {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as string,
    } as SignOptions);
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as string,
    } as SignOptions);
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}
