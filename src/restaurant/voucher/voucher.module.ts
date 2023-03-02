import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from '../../Schemas/voucher.schema';
import {
  RedeemVoucher,
  RedeemVoucherSchema,
} from '../../Schemas/redeemVoucher.schema';
import { Profile, ProfileSchema } from '../../Schemas/Profile.schema';

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
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
