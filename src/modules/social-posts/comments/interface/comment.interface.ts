import { Document } from 'mongoose';

export interface IComment extends Document {
  // postId: string;
  commentObject: {
    _id: any;
    userId: any;
    commentText: string;
    updatedAt: Date;
  };
}
