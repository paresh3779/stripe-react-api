import { User } from '@prisma/client';
import { IAuthService, LoginCredentials, RegisterData } from './interfaces/IAuthService';
import { userRepository } from '@repositories/user.repository';
import { tokenRepository } from '@repositories/token.repository';
import { tokenBlacklistRepository } from '@repositories/tokenBlacklist.repository';
import { loginAttemptRepository } from '@repositories/loginAttempt.repository';
import { PasswordUtil } from '@utils/password.util';
import { JwtUtil } from '@utils/jwt.util';
import { ConflictError, UnauthorizedError } from '@utils/error.util';
import { LoginResponse, AuthTokens } from '../types/common.types';

const MAX_SESSIONS = 5;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export class AuthService implements IAuthService {
  async register(data: RegisterData, ipAddress?: string, userAgent?: string, deviceInfo?: string): Promise<LoginResponse> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await PasswordUtil.hash(data.password);

    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user);

    await this.manageUserSessions(user.id);

    await tokenRepository.create({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress,
      userAgent,
      deviceInfo,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string, deviceInfo?: string): Promise<LoginResponse> {
    await this.checkAccountLockout(credentials.email);

    try {
      const user = await this.validateUser(credentials.email, credentials.password);

      await loginAttemptRepository.create({
        email: credentials.email,
        ipAddress: ipAddress || 'unknown',
        userAgent,
        success: true,
      });

      const tokens = await this.generateTokens(user);

      await this.manageUserSessions(user.id);

      await tokenRepository.create({
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress,
        userAgent,
        deviceInfo,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      await loginAttemptRepository.create({
        email: credentials.email,
        ipAddress: ipAddress || 'unknown',
        userAgent,
        success: false,
        failReason: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async refreshToken(refreshToken: string, ipAddress?: string, userAgent?: string, deviceInfo?: string): Promise<AuthTokens> {
    const isBlacklisted = await tokenBlacklistRepository.isTokenBlacklisted(refreshToken);
    if (isBlacklisted) {
      throw new UnauthorizedError('Token has been revoked');
    }

    const payload = JwtUtil.verifyRefreshToken(refreshToken);

    const storedToken = await tokenRepository.findByToken(refreshToken);
    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      await tokenRepository.deleteByToken(refreshToken);
      throw new UnauthorizedError('Refresh token expired');
    }

    const user = await userRepository.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    await tokenRepository.deleteByToken(refreshToken);

    const newTokens = await this.generateTokens(user);

    await this.manageUserSessions(user.id);

    await tokenRepository.create({
      token: newTokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress,
      userAgent,
      deviceInfo,
    });

    return newTokens;
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const storedToken = await tokenRepository.findByToken(refreshToken);
      if (storedToken) {
        await tokenBlacklistRepository.create({
          token: refreshToken,
          userId: storedToken.userId,
          reason: 'User logout',
          expiresAt: storedToken.expiresAt,
        });
      }
      await tokenRepository.deleteByToken(refreshToken);
    } catch (error) {
      // Token might already be deleted, ignore error
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is inactive');
    }

    const isPasswordValid = await PasswordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return user;
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: JwtUtil.generateAccessToken(payload),
      refreshToken: JwtUtil.generateRefreshToken(payload),
    };
  }

  private async checkAccountLockout(email: string): Promise<void> {
    const failedAttempts = await loginAttemptRepository.getRecentFailedAttempts(
      email,
      LOCKOUT_DURATION_MINUTES
    );

    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      throw new UnauthorizedError(
        `Account temporarily locked due to multiple failed login attempts. Please try again in ${LOCKOUT_DURATION_MINUTES} minutes.`
      );
    }
  }

  private async manageUserSessions(userId: string): Promise<void> {
    const tokenCount = await tokenRepository.getUserTokenCount(userId);
    
    if (tokenCount >= MAX_SESSIONS) {
      await tokenRepository.deleteOldestUserToken(userId);
    }
  }

  async logoutAllSessions(userId: string): Promise<void> {
    await tokenBlacklistRepository.blacklistUserTokens(userId, 'Logout all sessions');
    await tokenRepository.deleteByUserId(userId);
  }
}

export const authService = new AuthService();
