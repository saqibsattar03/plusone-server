import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import validator from 'validator';

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

  @Prop({ type: String, enum: ['PENDING', 'ACTIVE'], default: 'PENDING' })
  status: string;

  @Prop({ type: String })
  confirmationCode: string;

  @Prop({
    type: String,
    enum: ['STUDENT', 'NON-STUDENT'],
    default: 'NON-STUDENT',
  })
  accountHolderType: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
