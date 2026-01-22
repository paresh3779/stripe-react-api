import { BaseSeeder } from './BaseSeeder';
import { randomUUID } from 'crypto';

export class CouponsSeeder extends BaseSeeder {
  async run(): Promise<void> {
    this.log('Seeding coupons...');

    const coupons = [
      {
        id: randomUUID(),
        name: 'Welcome Discount',
        description: '20% off for new customers',
        stripeCouponId: 'coupon_' + randomUUID().substring(0, 10),
        discountType: 'PERCENTAGE' as const,
        discountValue: BigInt(20),
        currency: null,
        duration: 'ONCE' as const,
        durationInMonths: null,
        maxRedemptions: 100,
        timesRedeemed: 0,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        active: true,
      },
      {
        id: randomUUID(),
        name: 'Premium Annual',
        description: '$50 off annual subscriptions',
        stripeCouponId: 'coupon_' + randomUUID().substring(0, 10),
        discountType: 'FIXED' as const,
        discountValue: BigInt(5000),
        currency: 'usd',
        duration: 'ONCE' as const,
        durationInMonths: null,
        maxRedemptions: 50,
        timesRedeemed: 0,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        active: true,
      },
      {
        id: randomUUID(),
        name: 'Loyalty Reward',
        description: '15% off for 3 months',
        stripeCouponId: 'coupon_' + randomUUID().substring(0, 10),
        discountType: 'PERCENTAGE' as const,
        discountValue: BigInt(15),
        currency: null,
        duration: 'REPEATING' as const,
        durationInMonths: 3,
        maxRedemptions: null,
        timesRedeemed: 0,
        validFrom: new Date(),
        validUntil: null,
        active: true,
      },
    ];

    await this.prisma.coupon.createMany({
      data: coupons,
      skipDuplicates: true,
    });

    this.log(`Created ${coupons.length} coupons`);
  }
}
