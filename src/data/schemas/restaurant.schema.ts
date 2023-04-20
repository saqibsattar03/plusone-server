import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { LocationSchema } from './locationSchema';
import { Profile } from './profile.schema';

export type RestaurantDocument = HydratedDocument<Restaurant>;
@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Profile', required: true })
  userId: Profile;

  @Prop({ type: String, required: true })
  restaurantName: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop()
  menu: [string];

  @Prop({ type: String, required: [true, 'profile image is missing'] })
  profileImage: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: [String],
    required: [true, 'at least one timeline image is required'],
  })
  media: string[];

  @Prop({ type: LocationSchema })
  location: LocationSchema;

  @Prop()
  tags: [string];
  @Prop()
  dietaryRestrictions: [string];

  @Prop()
  culinaryOptions: [string];

  @Prop({
    type: Number,
    required: true,
    index: { unique: true },
  })
  uniqueCode: number;

  @Prop({ type: Number, default: null })
  verificationCode: number;

  @Prop({
    type: String,
    default: 'ACTIVE',
    enum: ['ACTIVE', 'DISABLED', 'PENDING'],
  })
  status: string;

  @Prop({ type: Boolean, default: false })
  isSponsored: boolean;

  @Prop({ type: Number, default: 0 })
  reviewCount: number;
  @Prop({ type: Number, default: 0 })
  totalVoucherCount: number;

  @Prop({ type: Number, default: 0 })
  totalDeposit: number;

  @Prop({ type: Number, default: 0 })
  availableDeposit: number;

  @Prop({ type: Number, default: 0 })
  totalSales: number;

  @Prop({ type: Number, default: 0 })
  totalDeductions: number;

  @Prop({ type: String })
  locationName: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
RestaurantSchema.index({ location: '2dsphere' });
