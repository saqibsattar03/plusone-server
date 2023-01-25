/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose'

export const PostSchema = new mongoose.Schema({
    username: String,
    location: String,
    caption: String,
    comments:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Comment'
    }],
    media:{
        fileName: String,
        filePath: String
      },
    created_at: { type: Date, default: Date.now },
});