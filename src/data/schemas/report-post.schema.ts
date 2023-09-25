import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';
import { Post } from './post.schema';

export type ReportPostDocument = HydratedDocument<ReportPost>;

@Schema({ timestamps: true })
export class ReportPost {
  @Prop({ type: mongoose.Types.ObjectId, ref: Profile.name, required: true })
  userId: Profile;

  @Prop({ type: mongoose.Types.ObjectId, ref: Post.name, required: true })
  postId: Post;

  @Prop({ type: String, default: '' })
  reportReason: string;
}

export const ReportPostSchema = SchemaFactory.createForClass(ReportPost);
