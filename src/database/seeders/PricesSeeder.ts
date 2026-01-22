import { BaseSeeder } from './BaseSeeder';
import { randomUUID } from 'crypto';

export class PricesSeeder extends BaseSeeder {
  async run(): Promise<void> {
    this.log('Seeding prices...');

    const products = await this.prisma.product.findMany({
      select: { id: true, slug: true },
    });

    const productMap = products.reduce((acc: Record<string, string>, p: { id: string; slug: string }) => {
      acc[p.slug] = p.id;
      return acc;
    }, {} as Record<string, string>);

    const prices = [
      {
        id: randomUUID(),
        productId: productMap['advanced-analytics-dashboard'],
        stripePriceId: 'price_' + randomUUID().substring(0, 10),
        description: 'Monthly subscription',
        amount: BigInt(2999),
        currency: 'usd',
        type: 'RECURRING' as const,
        interval: 'MONTH' as const,
        intervalCount: 1,
        trialDays: 7,
        features: JSON.stringify(['Real-time analytics', 'Custom reports']),
        active: true,
      },
      {
        id: randomUUID(),
        productId: productMap['advanced-analytics-dashboard'],
        stripePriceId: 'price_' + randomUUID().substring(0, 10),
        description: 'Yearly subscription',
        amount: BigInt(29999),
        currency: 'usd',
        type: 'RECURRING' as const,
        interval: 'YEAR' as const,
        intervalCount: 1,
        trialDays: 14,
        features: JSON.stringify(['Real-time analytics', 'Custom reports', 'Priority support']),
        active: true,
      },
      {
        id: randomUUID(),
        productId: productMap['online-learning-platform'],
        stripePriceId: 'price_' + randomUUID().substring(0, 10),
        description: 'One-time purchase',
        amount: BigInt(9999),
        currency: 'usd',
        type: 'ONE_TIME' as const,
        interval: null,
        intervalCount: 1,
        trialDays: null,
        features: JSON.stringify(['Lifetime access', 'Certificate of completion']),
        active: true,
      },
      {
        id: randomUUID(),
        productId: productMap['api-gateway-service'],
        stripePriceId: 'price_' + randomUUID().substring(0, 10),
        description: 'Per API call',
        amount: BigInt(10),
        currency: 'usd',
        type: 'RECURRING' as const,
        interval: 'MONTH' as const,
        intervalCount: 1,
        trialDays: null,
        features: JSON.stringify(['Unlimited API calls', 'Rate limiting']),
        active: true,
      },
      {
        id: randomUUID(),
        productId: productMap['digital-marketing-toolkit'],
        stripePriceId: 'price_' + randomUUID().substring(0, 10),
        description: 'Monthly subscription',
        amount: BigInt(4999),
        currency: 'usd',
        type: 'RECURRING' as const,
        interval: 'MONTH' as const,
        intervalCount: 1,
        trialDays: 7,
        features: JSON.stringify(['SEO tools', 'Social media scheduler']),
        active: true,
      },
      {
        id: randomUUID(),
        productId: productMap['digital-marketing-toolkit'],
        stripePriceId: 'price_' + randomUUID().substring(0, 10),
        description: 'Yearly subscription',
        amount: BigInt(49999),
        currency: 'usd',
        type: 'RECURRING' as const,
        interval: 'YEAR' as const,
        intervalCount: 1,
        trialDays: 14,
        features: JSON.stringify(['SEO tools', 'Social media scheduler', 'Advanced analytics']),
        active: true,
      },
      {
        id: randomUUID(),
        productId: productMap['e-commerce-platform'],
        stripePriceId: 'price_' + randomUUID().substring(0, 10),
        description: 'One-time purchase',
        amount: BigInt(19999),
        currency: 'usd',
        type: 'ONE_TIME' as const,
        interval: null,
        intervalCount: 1,
        trialDays: null,
        features: JSON.stringify(['Full e-commerce features', 'Payment integration']),
        active: true,
      },
    ];

    await this.prisma.price.createMany({
      data: prices,
      skipDuplicates: true,
    });

    this.log(`Created ${prices.length} prices`);
  }
}
