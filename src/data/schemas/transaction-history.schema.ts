import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Restaurant } from './restaurant.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export type TransactionHistoryDocument = HydratedDocument<TransactionHistory>;
@Schema({ timestamps: true })
export class TransactionHistory {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Restaurant.name,
    required: true,
  })
  restaurantId: Restaurant;

  @Prop({ type: String })
  voucherType: string;

  @Prop({ type: String })
  transactionType: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: Number })
  voucherSalePrice: number;

  @Prop({ type: Number })
  deductedAmount: number;

  @Prop({ type: Number })
  availableDeposit: number;

  @Prop({ type: Date })
  createAt: Date;
}
export const TransactionHistorySchema =
  SchemaFactory.createForClass(TransactionHistory);
