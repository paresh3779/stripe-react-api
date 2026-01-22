import { User } from '@prisma/client';
import { prisma } from '@config/database';
import { IUserRepository, CreateUserData } from './interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users as Omit<User, 'password'>[];
  }
}

export const userRepository = new UserRepository();
