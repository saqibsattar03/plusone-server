import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RedeemRestaurantDocument = HydratedDocument<RedeemRestaurant>;
@Schema({ timestamps: true })
export class RedeemRestaurant {
  @Prop()
  userId: string;

  @Prop()
  restaurantId: string;
}

export const RedeemRestaurantSchema =
  SchemaFactory.createForClass(RedeemRestaurant);
