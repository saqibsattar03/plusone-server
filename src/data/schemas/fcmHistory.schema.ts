import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FcmDocument = HydratedDocument<FcmHistory>;
@Schema({ timestamps: true })
export class FcmHistory {
  @Prop({ type: mongoose.Types.ObjectId, ref: Profile.name })
  userId: Profile;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: Boolean, default: false })
  seen: boolean;
}

export const FcmHistorySchema = SchemaFactory.createForClass(FcmHistory);
