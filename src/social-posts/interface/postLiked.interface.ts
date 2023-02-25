import { Document } from 'mongoose';

export interface IPostLiked extends Document {
  userId: [object];
  postId: object;
}
