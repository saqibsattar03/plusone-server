import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Profile } from './Profile.schema';

export type FollowerDocument = HydratedDocument<Follower>;
@Schema({ timestamps: true })
export class Follower {
  @Prop()
  userId: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }] })
  followers: Profile[];
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
