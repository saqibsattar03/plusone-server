import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DepositMoney,
  depositMoneySchema,
} from '../../data/schemas/deposit-money.schema';
import { DepositMoneyController } from './deposit-money.controller';
import { DepositMoneyService } from './deposit-money.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DepositMoney.name,
        schema: depositMoneySchema,
      },
    ]),
  ],
  controllers: [DepositMoneyController],
  providers: [DepositMoneyService],
})
export class DepositMoneyModule {}
