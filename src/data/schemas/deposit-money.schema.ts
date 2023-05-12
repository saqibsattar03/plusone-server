import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from './restaurant.schema';

export type DepositMoneyDocument = HydratedDocument<DepositMoney>;
@Schema({ timestamps: true })
export class DepositMoney {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Restaurant.name })
  restaurantId: Restaurant;

  @Prop()
  depositObject: [DepositStructure];
}

@Schema({ timestamps: true })
class DepositStructure {
  @Prop()
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  amount: number;
  //
  // @Prop({ type: Date, default: Date.now })
  // createdAt?: Date;
}

export const DepositMoneySchema = SchemaFactory.createForClass(DepositMoney);
