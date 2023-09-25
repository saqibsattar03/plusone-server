import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type ForgotPasswordDocument = HydratedDocument<ForgotPassword>;
@Schema()
export class ForgotPassword {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: User;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: Date, expires: 3600 })
  createdAt: Date;
}

export const ForgotPasswordSchema =
  SchemaFactory.createForClass(ForgotPassword);
