import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';
import { Post } from './post.schema';

export type LikedPostDocument = HydratedDocument<LikedPost>;

@Schema({ timestamps: true })
export class LikedPost {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }] })
  userId: Profile[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  postId: Post;
}

export const LikedPostSchema = SchemaFactory.createForClass(LikedPost);
