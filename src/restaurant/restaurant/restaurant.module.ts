import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from '../../Schemas/restaurant.schema';
import {
  RedeemVoucher,
  RedeemVoucherSchema,
} from '../../Schemas/redeemVoucher.schema';
import {
  RestaurantReview,
  RestaurantReviewSchema,
} from '../../Schemas/restaurantReview.schema';
import { Voucher, VoucherSchema } from '../../Schemas/voucher.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Restaurant.name,
        schema: RestaurantSchema,
      },
      {
        name: Voucher.name,
        schema: VoucherSchema,
      },
      {
        name: RedeemVoucher.name,
        schema: RedeemVoucherSchema,
      },
      {
        name: RestaurantReview.name,
        schema: RestaurantReviewSchema,
      },
    ]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
