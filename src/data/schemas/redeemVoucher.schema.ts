import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';
import { Voucher } from './voucher.schema';
import { Restaurant } from './restaurant.schema';

export type RedeemVoucherDocument = HydratedDocument<RedeemVoucher>;
@Schema({ timestamps: true })
export class RedeemVoucher {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  userId: Profile;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurantId: Restaurant;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' })
  voucherId: Voucher;

  @Prop({ type: String })
  verificationCode: string;
  @Prop({ type: Date, description: 'Created At' })
  createdAt?: Date;

  @Prop({ type: Date, description: 'Updated At' })
  updatedAt?: Date;
}

export const RedeemVoucherSchema = SchemaFactory.createForClass(RedeemVoucher);
