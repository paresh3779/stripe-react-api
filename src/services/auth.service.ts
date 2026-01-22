import { User } from '@prisma/client';
import { IAuthService, LoginCredentials, RegisterData } from './interfaces/IAuthService';
import { userRepository } from '@repositories/user.repository';
import { tokenRepository } from '@repositories/token.repository';
import { PasswordUtil } from '@utils/password.util';
import { JwtUtil } from '@utils/jwt.util';
import { ConflictError, UnauthorizedError } from '@utils/error.util';
import { LoginResponse, AuthTokens } from '../types/common.types';

export class AuthService implements IAuthService {
  async register(data: RegisterData): Promise<LoginResponse> {
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

    await tokenRepository.create({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const user = await this.validateUser(credentials.email, credentials.password);

    const tokens = await this.generateTokens(user);

    await tokenRepository.create({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
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

    await tokenRepository.create({
      token: newTokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return newTokens;
  }

  async logout(refreshToken: string): Promise<void> {
    await tokenRepository.deleteByToken(refreshToken);
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
}

export const authService = new AuthService();
