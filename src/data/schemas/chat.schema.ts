import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './profile.schema';

export type ChatDocument = HydratedDocument<Chat>;
@Schema()
export class Chat {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  senderId: Profile;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  to: Profile;

  @Prop()
  conversation: [MessageStructure];
}

export class MessageStructure {
  @Prop({ type: String })
  message: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  sender: Profile;
}
export const ChatSchema = SchemaFactory.createForClass(Chat);
