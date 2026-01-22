import { BaseSeeder } from './BaseSeeder';
import { randomUUID } from 'crypto';

export class PromoCodesSeeder extends BaseSeeder {
  async run(): Promise<void> {
    this.log('Seeding promo codes...');

    const coupons = await this.prisma.coupon.findMany({
      select: { id: true, name: true },
    });

    if (coupons.length === 0) {
      this.log('No coupons found, skipping promo codes');
      return;
    }

    const promoCodes = [
      {
        id: randomUUID(),
        couponId: coupons[0].id,
        code: 'WELCOME2024',
        stripePromoId: 'promo_' + randomUUID().substring(0, 10),
        maxRedemptions: 100,
        timesRedeemed: 0,
        active: true,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        couponId: coupons[1]?.id || coupons[0].id,
        code: 'ANNUAL50',
        stripePromoId: 'promo_' + randomUUID().substring(0, 10),
        maxRedemptions: 50,
        timesRedeemed: 0,
        active: true,
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        couponId: coupons[2]?.id || coupons[0].id,
        code: 'LOYALTY15',
        stripePromoId: 'promo_' + randomUUID().substring(0, 10),
        maxRedemptions: null,
        timesRedeemed: 0,
        active: true,
        expiresAt: null,
      },
    ];

    await this.prisma.promoCode.createMany({
      data: promoCodes,
      skipDuplicates: true,
    });

    this.log(`Created ${promoCodes.length} promo codes`);
  }
}
