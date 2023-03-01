import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './Profile.schema';
import { Restaurant } from './restaurant.schema';
import { Voucher } from './voucher.schema';

export type RedeemRestaurantDocument = HydratedDocument<RedeemRestaurant>;
@Schema({ timestamps: true })
export class RedeemRestaurant {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  userId: Profile;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }] })
  restaurantId: Restaurant[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }] })
  voucherId: Voucher[];
}

export const RedeemRestaurantSchema =
  SchemaFactory.createForClass(RedeemRestaurant);
