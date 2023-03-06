import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import validator from 'validator';
import { ProfileSchema } from './Profile.schema';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  surName: string;

  @Prop({ type: String, required: true, unique: true })
  userName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: ['pending', 'active'], default: 'pending' })
  status: string;

  @Prop({ type: String })
  confirmationCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
