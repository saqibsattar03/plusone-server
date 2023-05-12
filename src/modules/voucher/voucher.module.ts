import { forwardRef, Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from '../../data/schemas/voucher.schema';
import {
  RedeemVoucher,
  RedeemVoucherSchema,
} from '../../data/schemas/redeemVoucher.schema';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { DepositMoneyModule } from '../deposit-money/deposit-money.module';
import { FcmModule } from '../fcm/fcm.module';
import { TransactionHistoryModule } from '../transaction-history/transaction-history.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Voucher.name,
        schema: VoucherSchema,
      },
      {
        name: RedeemVoucher.name,
        schema: RedeemVoucherSchema,
      },
    ]),
    RestaurantModule,
    forwardRef(() => ProfilesModule),
    DepositMoneyModule,
    TransactionHistoryModule,
    // FcmModule,
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VoucherModule {}
