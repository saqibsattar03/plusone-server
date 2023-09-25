import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StampCard } from './stamp-card.schema';
import { Profile } from './profile.schema';
import { Restaurant } from './restaurant.schema';

export type StampCardHistoryDocument = HydratedDocument<StampCardHistory>;
@Schema({ timestamps: true })
export class StampCardHistory {
  @Prop({ type: mongoose.Types.ObjectId, ref: StampCard.name })
  cardId: StampCard;

  @Prop({ type: mongoose.Types.ObjectId, ref: Profile.name })
  userId: Profile;

  @Prop({ type: mongoose.Types.ObjectId, ref: Restaurant.name })
  restaurantId: Restaurant;

  // @Prop({ type: Number })
  // redeemedPoints: number;

  // @Prop({ type: Number, default: 0 })
  // totalPoints: number;

  @Prop({ type: String })
  reward: string;
}
export const StampCardHistorySchema =
  SchemaFactory.createForClass(StampCardHistory);
