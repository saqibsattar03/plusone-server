import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from './restaurant.schema';

export type VoucherDocument = HydratedDocument<Voucher>;
@Schema({ timestamps: true })
export class Voucher {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Restaurant' })
  restaurantId: Restaurant;
  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop()
  text: string;
  @Prop({
    type: String,
    enum: ['student', 'non-student'],
    default: 'non-student',
  })
  voucherType: string;
  @Prop({ type: Number, required: true, unique: true })
  voucherCode: number;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
