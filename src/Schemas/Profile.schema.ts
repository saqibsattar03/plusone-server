import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';

export type ProfileDocument = HydratedDocument<Profile>;
@Schema({ timestamps: true })
export class Profile {
  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  // user: User;

  @Prop()
  bio: string;

  @Prop({ type: String, enum: ['public', 'private'], default: 'public' })
  accountType: string;
  // @Prop({ type: Boolean, default: false })
  // isPrivate: boolean;

  @Prop()
  links: [string];

  @Prop({
    type: String,
    unique: true,
    required: [true, 'user name is required'],
  })
  userName: string;

  // @Prop()
  // profileImage: {
  //   filename: string;
  //   filepath: string;
  // };

  @Prop({
    type: String,
    enum: ['student', 'nonStudent'],
    default: 'nonStudent',
  })
  accountHolderType: string;
  // @Prop({ type: Boolean, default: false })
  // isStudentAccount: boolean;

  @Prop()
  dietRequirements: [string];
  @Prop()
  answers: [string];

  @Prop()
  favoriteCuisine: [string];

  @Prop()
  favoriteChef: [string];
  @Prop({ type: Number, default: '' })
  voucherVerificationCode: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
