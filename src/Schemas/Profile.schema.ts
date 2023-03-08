import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { PointSchema } from './point.schema';

export type ProfileDocument = HydratedDocument<Profile>;
@Schema({ timestamps: true })
export class Profile extends User {
  @Prop()
  email: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  bio: string;

  @Prop({ type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' })
  accountType: string;

  @Prop()
  links: [string];

  @Prop({
    type: String,
    enum: ['PUBLIC', 'FRIENDS', 'ONLY-ME'],
    default: 'PUBLIC',
  })
  postAudiencePreference: string;

  @Prop({
    type: String,
    unique: true,
    required: [true, 'user name is required'],
  })
  userName: string;

  @Prop({ type: String })
  profileImage: string;

  @Prop()
  dietRequirements: [string];
  @Prop()
  favoriteRestaurant: [string];

  @Prop()
  favoriteCuisine: [string];

  @Prop()
  favoriteChef: [string];

  @Prop()
  location: PointSchema;

  @Prop({ type: Number, default: 0 })
  rewardPoints: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
