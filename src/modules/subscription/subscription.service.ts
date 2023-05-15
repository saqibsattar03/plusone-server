import { Injectable } from '@nestjs/common';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly profileService: ProfilesService) {}
  async subscribe(data): Promise<any> {
    const cases = 'initialPurchase';
    switch (cases) {
      case 'initialPurchase': {
        const data = {
          productId: 'com.subscription.weekly',
          purchasedAt: '12-03-2023',
          expirationAt: '12-04-2023',
        };
      }
    }
  }
}
