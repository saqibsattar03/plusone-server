/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose'

export const CommentSchema = new mongoose.Schema({
    userId: String,
    postId: {type: mongoose.Schema.Types.ObjectId, ref:"Post"},
    comment: String,
    created_at: { type: Date, default: Date.now },
});