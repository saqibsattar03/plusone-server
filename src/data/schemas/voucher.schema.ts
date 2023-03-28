import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from './restaurant.schema';

export type VoucherDocument = HydratedDocument<Voucher>;
@Schema({ timestamps: true })
export class Voucher {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurantId: Restaurant;
  @Prop()
  voucherObject: [VoucherStructure];
  @Prop({ type: () => Number, default: 0 })
  studentVoucherCount: number;
  @Prop({ type: () => Number, default: 0 })
  nonStudentVoucherCount: number;
}
@Schema()
export class VoucherStructure {
  @Prop()
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: () => Number, default: 0 })
  discount: number;

  @Prop()
  description: string;

  @Prop({
    type: () => String,
    enum: ['STUDENT', 'NON-STUDENT', 'BOTH'],
    default: 'NON-STUDENT',
  })
  voucherPreference: string;

  @Prop({ type: () => String, default: 'BOGO', enum: ['BOGO', 'DISCOUNTED'] })
  voucherType: string;

  @Prop({
    type: Number,
    required: true,
    index: { unique: true },
  })
  voucherCode: number;
  @Prop({
    type: () => String,
  })
  estimatedSavings: string;
  @Prop({
    type: Number,
    default: 0,
  })
  estimatedCost: number;
  @Prop({ type: () => String })
  voucherImage: string;
}
export const VoucherSchema = SchemaFactory.createForClass(Voucher);
