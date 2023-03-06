/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';
import { Profile } from "./Profile.schema";

export type PostDocument = HydratedDocument<Post>;
@Schema({ timestamps: true })
export class Post {

 @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  userId: Profile;

  @Prop()
  location: string;

  @Prop()
  caption: string;

  @Prop({
    type: String,
    enum: ['public', 'friends', 'only-me'],
    default: 'public',
  })
  postAudiencePreference: string;

  @Prop()
  media: [
    {
      fileName: string;
      filePath: string;
    },
  ];

  @Prop({type : Number, default:0 })
  likesCount: number;

  @Prop({type: Number, default:0})
  commentCount:number

}

export const PostSchema = SchemaFactory.createForClass(Post)
