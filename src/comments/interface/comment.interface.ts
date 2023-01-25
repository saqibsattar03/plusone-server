/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface IComment extends Document {
    userId: string;
    postId: string,
    comment: string,
}