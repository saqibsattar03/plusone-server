import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfilesService } from '../profiles/profiles.service';
import { Constants } from '../../common/constants';

@Injectable()
export class SubscriptionService {
  constructor(private readonly profileService: ProfilesService) {}
  async subscribe(data): Promise<any> {
    const cases = data.event.type;
    switch (cases) {
      case 'TEST': {
        const email = 'saqibsattar710@gmail.com';
        const res = await this.updateSubscription(
          email,
          data.event.product_id,
          data.event.purchased_at_ms,
          data.event.expiration_at_ms,
          true,
        );

        break;
      }
      case Constants.INITIAL_PURCHASE: {
        await this.updateSubscription(
          data.event.app_user_id,
          data.event.product_id,
          data.event.purchased_at_ms,
          data.event.expiration_at_ms,
          true,
        );

        break;
      }

      case Constants.RENEWAL: {
        await this.updateSubscription(
          data.event.app_user_id,
          data.event.product_id,
          data.event.purchased_at_ms,
          data.event.expiration_at_ms,
          true,
        );

        break;
      }

      case Constants.EXPIRATION: {
        await this.updateSubscription(
          data.event.app_user_id,
          data.event.product_id,
          data.event.purchased_at_ms,
          data.event.expiration_at_ms,
          false,
        );

        break;
      }

      case Constants.TRANSFER: {
        const user1 = await this.profileService.getUserFields(
          data.event.transferred_from,
        );
        const transferredFrom = {
          isPremium: false,
          purchasedAt: null,
          expirationAt: null,
          productId: null,
          email: user1.email,
        };
        await this.profileService.updateProfile(transferredFrom);

        const user2 = await this.profileService.getUserFields(
          data.event.transferred_to,
        );
        const transferredTo = {
          isPremium: true,
          purchasedAt: data.event.purchasedAt,
          expirationAt: data.event.expirationAt,
          productId: data.event.productId,
          email: user2.email,
        };
        await this.profileService.updateProfile(transferredTo);
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
      throw new HttpException('subscription failed.', HttpStatus.BAD_REQUEST);
    }
  }
}
