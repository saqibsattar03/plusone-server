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

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Restaurant.name,
        schema: RestaurantSchema,
      },
      {
        name: RedeemVoucher.name,
        schema: RedeemVoucherSchema,
      },
    ]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
