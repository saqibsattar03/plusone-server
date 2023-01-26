/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';
import { User } from './user.schema';

export type PostDocument = HydratedDocument<Post>;
@Schema({ timestamps: true })
export class Post {

  @Prop()
  username: string;

  @Prop()
  locations: string;

  @Prop()
  caption: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({required: true})
  media: [
    {
      fileName: string;
      filePath: string;
    },
  ];

  @Prop({type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]})
  likes: User[]
}

export const PostSchema = SchemaFactory.createForClass(Post)

// import * as mongoose from 'mongoose'

// export const PostSchema = new mongoose.Schema({
//     username: String,
//     location: String,
//     caption: String,
//     comments:[{
//       type: mongoose.Schema.Types.ObjectId,
//       ref:'Comment'
//     }],
//     media:[{
//         fileName: String,
//         filePath: String
//       }],
//     created_at: { type: Date, default: Date.now },
// });
