import { Document } from 'mongoose';

export interface IComment extends Document {
  // postId: string;
  comment: {
    userId: string;
    commentText: string;
  };
}
