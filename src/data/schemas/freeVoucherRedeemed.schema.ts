import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';
import { Restaurant } from './restaurant.schema';

export type FreeVoucherDocument = HydratedDocument<FreeVoucherRedeemed>;
@Schema({ timestamps: true })
export class FreeVoucherRedeemed {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  userId: Profile;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurantId: Restaurant;
}

export const FreeVoucherRedeemedSchema =
  SchemaFactory.createForClass(FreeVoucherRedeemed);
