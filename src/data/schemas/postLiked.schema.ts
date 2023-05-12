import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';
import { Post } from './post.schema';

export type LikedPostDocument = HydratedDocument<LikedPost>;

@Schema({ timestamps: true })
export class LikedPost {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Profile.name }] })
  userId: Profile[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Post.name })
  postId: Post;
}

export const LikedPostSchema = SchemaFactory.createForClass(LikedPost);
