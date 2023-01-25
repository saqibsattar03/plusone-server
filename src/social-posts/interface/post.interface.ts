/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface IPost extends Document {
    username: string;
    location: string,
    caption: string,
    comments:[],
    media: {
        fileName: string,
        filePath: string
      },

}