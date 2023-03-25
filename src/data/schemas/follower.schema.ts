import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Profile } from './profile.schema';

export type FollowerDocument = HydratedDocument<Follower>;
@Schema({ timestamps: true })
export class Follower {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  userId: Profile;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }] })
  followers: Profile[];
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
