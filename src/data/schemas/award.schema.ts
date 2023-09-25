import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';
import { StampCard } from './stamp-card.schema';
import { Restaurant } from './restaurant.schema';

export type AwardDocument = HydratedDocument<Award>;
@Schema({ timestamps: true })
export class Award {
  @Prop({ type: mongoose.Types.ObjectId, ref: Profile.name })
  userId: Profile;

  @Prop({ type: mongoose.Types.ObjectId, red: StampCard.name })
  cardId: StampCard;

  @Prop({ type: mongoose.Types.ObjectId, ref: Restaurant.name })
  restaurantId: Restaurant;

  @Prop({ type: mongoose.Types.ObjectId, ref: Profile.name })
  shareTo: Profile;

  @Prop({ type: Boolean, default: false })
  isAwarded: boolean;

  @Prop({ type: String })
  reward: string;

  @Prop({ type: Number, unique: true })
  uniqueNumber: number;
}

export const AwardSchema = SchemaFactory.createForClass(Award);
