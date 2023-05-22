import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';

export type FollowRequestDocument = HydratedDocument<FollowRequest>;
@Schema({ timestamps: true })
export class FollowRequest {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Profile.name,
    index: true,
  })
  requestedFrom: Profile;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Profile.name,
    index: true,
  })
  requestedTo: Profile;
}
export const FollowRequestSchema = SchemaFactory.createForClass(FollowRequest);
