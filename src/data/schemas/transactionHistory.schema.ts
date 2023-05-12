import { Prop, Schema } from '@nestjs/mongoose';
import { Restaurant } from './restaurant.schema';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class TransactionHistory {
  @Prop({ type: new mongoose.Types.ObjectId(), ref: Restaurant.name })
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
  currentBalance: number;
}
