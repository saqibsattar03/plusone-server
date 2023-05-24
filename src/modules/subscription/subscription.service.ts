import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly profileService: ProfilesService) {}
  async subscribe(data): Promise<any> {
    const cases = data.event.type;
    switch (cases) {
      case 'TEST': {
        console.log(data.event.subscriber_attributes.$email.value);
        const email = 'saqib@gmail.com';
        const res = await this.updateSubscription(
          email,
          data.event.product_id,
          data.event.purchased_at_ms,
          data.event.expiration_at_ms,
          true,
        );
        console.log('data updated');
        break;
      }
      case 'INITIAL': {
        console.log('in initial stage');
        const email = 'saqib@gmail.com';
        const res = await this.updateSubscription(
          email,
          data.event.product_id,
          data.event.purchased_at_ms,
          data.event.expiration_at_ms,
          true,
        );
        console.log('data updated');
        break;
      }
      case 'CANCELLATION': {
        console.log('in CANCELLATION stage');
        const email = 'saqib@gmail.com';
        const res = await this.updateSubscription(
          email,
          data.event.product_id,
          data.event.purchased_at_ms,
          data.event.expiration_at_ms,
          false,
        );
        console.log('data updated');
        break;
      }
      case 'SUBSCRIPTION_PAUSED': {
        console.log('in SUBSCRIPTION_PAUSED stage');
        const email = 'saqib@gmail.com';
        const res = await this.updateSubscription(
          email,
          null,
          null,
          null,
          false,
        );
        console.log('data updated');
        break;
      }
      case 'TRANSFER': {
        console.log('TRANSFER');
        const transferredFrom = await this.profileService.getUserFields(
          'hdjkfhjkhfdjhfjkdh',
        );
        const d = {
          isPremium: false,
          purchasedAt: null,
          expirationAt: null,
          productId: null,
          email: transferredFrom.email,
        };
        await this.profileService.updateProfile(d);

        const transferredTo = await this.profileService.getUserFields(
          'dfhjhfkdhfjkhkd',
        );
        const d1 = {
          isPremium: true,
          purchasedAt: data.event.purchasedAt,
          expirationAt: data.event.expirationAt,
          productId: data.event.productId,
          email: transferredFrom.email,
        };
        await this.profileService.updateProfile(d1);
        break;
      }
    }
  }

  async updateSubscription(
    email: string,
    productId: string,
    purchasedAt,
    expirationAt,
    isPremium,
  ): Promise<any> {
    try {
      const data = {
        email: email,
        productId: productId,
        purchasedAt: purchasedAt,
        expirationAt: expirationAt,
        isPremium: isPremium,
      };
      await this.profileService.updateProfile(data);
      return true;
    } catch (e) {
      throw new HttpException('subscription failed', HttpStatus.BAD_REQUEST);
    }
  }
}
