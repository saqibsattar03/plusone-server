import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StampCard } from './stamp-card.schema';
import { Profile } from './profile.schema';
import { Restaurant } from './restaurant.schema';

export type UserStampCardDocument = HydratedDocument<UserStampCard>;
@Schema({ timestamps: true })
export class UserStampCard {
  @Prop({ type: mongoose.Types.ObjectId, ref: StampCard.name })
  cardId: StampCard;

  @Prop({ type: mongoose.Types.ObjectId, ref: Profile.name })
  userId: Profile;

  @Prop({ type: mongoose.Types.ObjectId, ref: Restaurant.name })
  restaurantId: Restaurant;

  @Prop({ type: String, enum: ['ACTIVE', 'DISABLED'], default: 'ACTIVE' })
  status: string;

  @Prop({ type: Number })
  redeemedPoints: number;

  @Prop({ type: Date })
  startDate: Date;
}

export const UserStampCardSchema = SchemaFactory.createForClass(UserStampCard);
