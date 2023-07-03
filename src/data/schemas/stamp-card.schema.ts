import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from './restaurant.schema';

export type StampCardDocument = HydratedDocument<StampCard>;

@Schema({ timestamps: true })
export class StampCard {
  @Prop({ type: mongoose.Types.ObjectId, ref: Restaurant.name })
  restaurantId: Restaurant;

  @Prop({ type: Number, default: 0 })
  totalPoints: number;

  @Prop({ type: String, enum: ['STUDENT', 'NON-STUDENT', 'BOTH'] })
  type: string;

  @Prop({ type: Number })
  timeDurationInDays: number;

  @Prop({ type: String })
  reward: string;
}

export const StampCardSchema = SchemaFactory.createForClass(StampCard);
