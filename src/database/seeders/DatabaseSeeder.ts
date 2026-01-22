import { PrismaClient } from '@prisma/client';
import { logger } from '@config/logger';
import { ProductsSeeder } from './ProductsSeeder';
import { PricesSeeder } from './PricesSeeder';
import { CouponsSeeder } from './CouponsSeeder';
import { PromoCodesSeeder } from './PromoCodesSeeder';

export class DatabaseSeeder {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async run(): Promise<void> {
    try {
      logger.info('🌱 Starting database seeding...');

      await new ProductsSeeder(this.prisma).run();
      await new PricesSeeder(this.prisma).run();
      await new CouponsSeeder(this.prisma).run();
      await new PromoCodesSeeder(this.prisma).run();

      logger.info('✅ Database seeding completed successfully!');
    } catch (error) {
      logger.error('❌ Database seeding failed:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

// Run seeder if executed directly
if (require.main === module) {
  const seeder = new DatabaseSeeder();
  seeder.run()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
