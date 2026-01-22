import { faker } from '@faker-js/faker';

export abstract class BaseFactory<T> {
  protected faker = faker;

  abstract definition(): Partial<T>;

  create(overrides?: Partial<T>): Partial<T> {
    return {
      ...this.definition(),
      ...overrides,
    };
  }

  createMany(count: number, overrides?: Partial<T>): Partial<T>[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
