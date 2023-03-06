import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { PointSchema } from './point.schema';
import { ImageSchema } from './image.schema';

export type ProfileDocument = HydratedDocument<Profile>;
@Schema({ timestamps: true })
export class Profile extends User {
  @Prop()
  email: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

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
    enum: ['public', 'friends', 'only-me'],
    default: 'public',
  })
  postAudiencePreference: string;

  @Prop({
    type: String,
    unique: true,
    required: [true, 'user name is required'],
  })
  userName: string;

  @Prop({ type: String })
  profileImage: ImageSchema;

  @Prop({
    type: String,
    enum: ['STUDENT', 'NON-STUDENT'],
    default: 'NON-STUDENT',
  })
  accountHolderType: string;

  @Prop()
  dietRequirements: [string];
  @Prop()
  answers: [string];

  @Prop()
  favoriteCuisine: [string];

  @Prop()
  favoriteChef: [string];

  // @Prop()
  // location: PointSchema;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
