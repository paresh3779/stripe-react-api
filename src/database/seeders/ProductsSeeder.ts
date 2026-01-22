import { BaseSeeder } from './BaseSeeder';
import { randomUUID } from 'crypto';

export class ProductsSeeder extends BaseSeeder {
  async run(): Promise<void> {
    this.log('Seeding products...');

    const products = [
      {
        id: randomUUID(),
        name: 'Advanced Analytics Dashboard',
        slug: 'advanced-analytics-dashboard',
        description: 'Comprehensive analytics and reporting tool for businesses to track performance and insights.',
        image: 'https://example.com/analytics-dashboard.jpg',
        stripeProductId: 'prod_' + randomUUID().substring(0, 10),
        type: 'SUBSCRIPTION' as const,
        active: true,
        isArchived: false,
        archivedDate: null,
      },
      {
        id: randomUUID(),
        name: 'Online Learning Platform',
        slug: 'online-learning-platform',
        description: 'Access to premium courses, certifications, and educational resources for professional development.',
        image: 'https://example.com/learning-platform.jpg',
        stripeProductId: 'prod_' + randomUUID().substring(0, 10),
        type: 'ONE_TIME' as const,
        active: true,
        isArchived: false,
        archivedDate: null,
      },
      {
        id: randomUUID(),
        name: 'API Gateway Service',
        slug: 'api-gateway-service',
        description: 'Scalable API management, monitoring, and security for enterprise applications.',
        image: 'https://example.com/api-gateway.jpg',
        stripeProductId: 'prod_' + randomUUID().substring(0, 10),
        type: 'USAGE_BASED' as const,
        active: true,
        isArchived: false,
        archivedDate: null,
      },
      {
        id: randomUUID(),
        name: 'Digital Marketing Toolkit',
        slug: 'digital-marketing-toolkit',
        description: 'Complete toolkit for SEO, social media management, and email marketing campaigns.',
        image: 'https://example.com/marketing-toolkit.jpg',
        stripeProductId: 'prod_' + randomUUID().substring(0, 10),
        type: 'SUBSCRIPTION' as const,
        active: true,
        isArchived: false,
        archivedDate: null,
      },
      {
        id: randomUUID(),
        name: 'E-commerce Platform',
        slug: 'e-commerce-platform',
        description: 'Full-featured online store setup with inventory management and payment processing.',
        image: 'https://example.com/ecommerce-platform.jpg',
        stripeProductId: 'prod_' + randomUUID().substring(0, 10),
        type: 'ONE_TIME' as const,
        active: true,
        isArchived: false,
        archivedDate: null,
      },
    ];

    await this.prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    });

    this.log(`Created ${products.length} products`);
  }
}
