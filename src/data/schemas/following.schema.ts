import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';

export type FollowingDocument = HydratedDocument<Following>;
@Schema({ timestamps: true })
export class Following {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  userId: Profile;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }] })
  followings: Profile[];
}
export const FollowingSchema = SchemaFactory.createForClass(Following);
