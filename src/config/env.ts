import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  API_PREFIX: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  BCRYPT_ROUNDS: number;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  CORS_ORIGIN: string;
  LOG_LEVEL: string;
}

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env: EnvConfig = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: parseInt(getEnv('PORT', '3000'), 10),
  API_PREFIX: getEnv('API_PREFIX', '/api'),
  DATABASE_URL: getEnv('DATABASE_URL'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  BCRYPT_ROUNDS: parseInt(getEnv('BCRYPT_ROUNDS', '12'), 10),
  RATE_LIMIT_WINDOW_MS: parseInt(getEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(getEnv('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
  CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:3001'),
  LOG_LEVEL: getEnv('LOG_LEVEL', 'info'),
};

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
