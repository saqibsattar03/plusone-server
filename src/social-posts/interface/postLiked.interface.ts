/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface IPostLiked extends Document {
  userId: string;
  postId: string;
}
