import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';
import { LocationSchema } from './locationSchema';
import { Voucher } from './voucher.schema';

export type PostDocument = HydratedDocument<Post>;
@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  userId: Profile;

  @Prop({ type: LocationSchema })
  location: LocationSchema;

  @Prop()
  caption: string;

  @Prop({
    type: String,
    enum: ['PUBLIC', 'FRIENDS', 'ONLY-ME'],
    default: 'PUBLIC',
  })
  postAudiencePreference: string;

  @Prop({ type: String, enum: ['FEED', 'REVIEW'] })
  postType: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' })
  voucherId: Voucher;

  @Prop({ type: [String] })
  media: string[];

  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  commentCount: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index({ caption: 'text' });
PostSchema.index({ location: '2dsphere' });
