import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from './post.schema';
import { Profile } from './Profile.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  postId: Post;

  @Prop()
  commentObject: [CommentStructure];
}

@Schema({ timestamps: true })
export class CommentStructure {
  @Prop()
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  userId: Profile;

  @Prop({ type: String })
  commentText: string;

  @Prop({ type: () => Date, description: 'Updated At' })
  updatedAt?: Date;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
