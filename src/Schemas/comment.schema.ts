/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Post } from "./post.schema";

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Comment{
   
    @Prop()
    userId: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    postId: Post;

    @Prop()
    comment: string;



}
export const CommentSchema = SchemaFactory.createForClass(Comment)


// import * as mongoose from 'mongoose'

// export const CommentSchema = new mongoose.Schema({
//     userId: String,
//     postId: {type: mongoose.Schema.Types.ObjectId, ref:"Post"},
//     comment: String,
//     created_at: { type: Date, default: Date.now },
// });