import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DepositMoney,
  DepositMoneySchema,
} from '../../data/schemas/deposit-money.schema';
import { DepositMoneyController } from './deposit-money.controller';
import { DepositMoneyService } from './deposit-money.service';
import {
  PaymentDetail,
  PaymentDetailSchema,
} from '../../data/schemas/payment-detail.schema';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DepositMoney.name,
        schema: DepositMoneySchema,
      },
      {
        name: PaymentDetail.name,
        schema: PaymentDetailSchema,
      },
    ]),
    RestaurantModule,
  ],
  controllers: [DepositMoneyController],
  providers: [DepositMoneyService],
  exports: [DepositMoneyService],
})
export class DepositMoneyModule {}
