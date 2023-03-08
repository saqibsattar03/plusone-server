/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';
import { Profile } from "./Profile.schema";
import { PointSchema } from "./point.schema";
import { ImageSchema } from "./image.schema";

export type PostDocument = HydratedDocument<Post>;
@Schema({ timestamps: true })
export class Post {

 @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  userId: Profile;

  @Prop({type: PointSchema})
  location: PointSchema;

  @Prop()
  caption: string;

  @Prop({
    type: String,
    enum: ['PUBLIC', 'FRIENDS', 'ONLY-ME'],
    default: 'PUBLIC',
  })
  postAudiencePreference: string;

  @Prop({ type: [String] })
  media: string[]

  @Prop({type : Number, default:0 })
  likesCount: number;

  @Prop({type: Number, default:0})
  commentCount:number

}

export const PostSchema = SchemaFactory.createForClass(Post)
