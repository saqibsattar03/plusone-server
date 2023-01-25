/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const PostLikedSchema = new mongoose.Schema({
  userId: String,
  postId: String,
});
