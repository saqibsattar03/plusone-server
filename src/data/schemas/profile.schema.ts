import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import validator from 'validator';
import { Restaurant } from './restaurant.schema';

export type ProfileDocument = HydratedDocument<Profile>;
@Schema({ timestamps: true })
export class Profile extends User {
  @Prop({ type: String })
  firstname: string;

  @Prop({ type: String })
  surname: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  })
  email: string;

  @Prop({
    type: String,
    enum: ['PENDING', 'ACTIVE', 'DELETED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({ type: String, select: false })
  confirmationCode: string;

  @Prop({
    type: String,
    enum: ['USER', 'ADMIN', 'MERCHANT'],
    default: 'USER',
  })
  role: string;

  @Prop()
  bio: string;

  @Prop({ type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' })
  accountType: string;

  @Prop()
  instagramLink: string;

  @Prop()
  tiktokLink: string;

  @Prop({
    type: String,
    enum: ['PUBLIC', 'FRIENDS', 'ONLY-ME'],
    default: 'PUBLIC',
  })
  postAudiencePreference: string;

  @Prop({ type: String })
  profileImage: string;

  @Prop()
  dietRequirements: [string];

  @Prop()
  favoriteRestaurants: [string];

  @Prop()
  favoriteCuisines: [string];

  @Prop()
  favoriteChefs: [string];

  @Prop({ type: Number, default: 0 })
  rewardPoints: number;

  @Prop({ type: Boolean, default: false })
  isPremium: boolean;

  @Prop({ type: Boolean, default: null })
  isSkip: boolean;

  @Prop({
    type: String,
    enum: ['STUDENT', 'NON-STUDENT', null],
    default: null,
  })
  accountHolderType: string;

  @Prop({ type: [String] })
  scopes: [string];

  @Prop({ type: Number })
  estimatedSavings: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
