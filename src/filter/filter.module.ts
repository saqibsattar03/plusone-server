import { Module } from '@nestjs/common';
import { FilterController } from './filter.controller';
import { FilterService } from './filter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from '../Schemas/restaurant.schema';
import { Profile, ProfileSchema } from '../Schemas/Profile.schema';
import {
  RedeemVoucher,
  RedeemVoucherSchema,
} from '../Schemas/redeemVoucher.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Restaurant.name,
        schema: RestaurantSchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
      {
        name: RedeemVoucher.name,
        schema: RedeemVoucherSchema,
      },
    ]),
  ],
  controllers: [FilterController],
  providers: [FilterService],
})
export class FilterModule {}
