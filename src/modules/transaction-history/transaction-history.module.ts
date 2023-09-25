import { Module } from '@nestjs/common';
import { TransactionHistoryController } from './transaction-history.controller';
import { TransactionHistoryService } from './transaction-history.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionHistory,
  TransactionHistorySchema,
} from '../../data/schemas/transaction-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TransactionHistory.name,
        schema: TransactionHistorySchema,
      },
    ]),
  ],
  controllers: [TransactionHistoryController],
  providers: [TransactionHistoryService],
  exports: [TransactionHistoryService],
})
export class TransactionHistoryModule {}
