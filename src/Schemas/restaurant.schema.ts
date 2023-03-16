import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PointSchema } from './point.schema';

export type RestaurantDocument = HydratedDocument<Restaurant>;
@Schema({ timestamps: true })
export class Restaurant {
  @Prop()
  phoneNumber: number;
  @Prop()
  menu: [string];
  @Prop()
  description: string;
  @Prop({ type: Number, default: 6 })
  voucherCount: number;
  @Prop({ type: [String] })
  media: string[];

  @Prop({ type: PointSchema })
  location: PointSchema;
  @Prop()
  tags: [string];
  @Prop()
  dietaryRestrictions: [string];

  @Prop()
  culinaryOptions: [string];

  @Prop({
    type: Number,
    required: true,
    default: function () {
      return Math.floor(Math.random() * 1834 + 1573);
    },
    index: { unique: true },
  })
  uniqueCode: number;

  @Prop({ type: Number, default: null })
  verificationCode: number;

  @Prop({ type: Boolean, default: false })
  isSponsored: boolean;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
RestaurantSchema.index({ location: '2dsphere' });
RestaurantSchema.index({ description: 'text' });
