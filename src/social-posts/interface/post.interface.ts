/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface IPost extends Document {
    userId: object;
    location: string,
    caption: string,
    media: [{
        fileName: string,
        filePath: string
      }],

}