import { BaseFactory } from './BaseFactory';
import { User } from '@prisma/client';
import { PasswordUtil } from '@utils/password.util';
import { randomUUID } from 'crypto';

export class UserFactory extends BaseFactory<User> {
  definition(): Partial<User> {
    return {
      id: randomUUID(),
      firstName: this.faker.person.firstName(),
      lastName: this.faker.person.lastName(),
      email: this.faker.internet.email(),
      password: 'Password123!',
      role: 'USER',
      isActive: true,
      emailVerifiedAt: this.faker.date.recent(),
      rememberToken: null,
    };
  }

  async createWithHashedPassword(overrides?: Partial<User>): Promise<Partial<User>> {
    const user = this.create(overrides);
    if (user.password) {
      user.password = await PasswordUtil.hash(user.password);
    }
    return user;
  }

  unverified(): Partial<User> {
    return this.create({ emailVerifiedAt: null });
  }

  admin(): Partial<User> {
    return this.create({ role: 'ADMIN' });
  }

  superAdmin(): Partial<User> {
    return this.create({ role: 'SUPER_ADMIN' });
  }
}

export const userFactory = new UserFactory();
