import { LoginResponse, AuthTokens } from '../../types/common.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface IAuthService {
  register(data: RegisterData): Promise<LoginResponse>;
  login(credentials: LoginCredentials): Promise<LoginResponse>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  logout(refreshToken: string): Promise<void>;
  validateUser(email: string, password: string): Promise<any>;
}
