/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LikedPostDocument = HydratedDocument<LikedPost>;

@Schema({ timestamps: true })

export class LikedPost{

  // @Prop()
  // userId: string;
  
  @Prop()
  postId: string;
}

export const LikedPostSchema = SchemaFactory.createForClass(LikedPost)

