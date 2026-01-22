import { User } from '@prisma/client';

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Omit<User, 'password'>[]>;
}
