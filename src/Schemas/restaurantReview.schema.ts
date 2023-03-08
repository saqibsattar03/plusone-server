import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './Profile.schema';
import any = jasmine.any;
import { Restaurant } from './restaurant.schema';

export type RestaurantReviewDocument = HydratedDocument<RestaurantReview>;
@Schema()
export class RestaurantReview {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurantId: Restaurant;

  @Prop()
  reviewObject: [ReviewStructure];
}

@Schema()
export class ReviewStructure {
  @Prop()
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  userId: Profile;

  @Prop({ type: String })
  reviewText: string;

  @Prop({
    type: Number,
    default: 1,
    validate: {
      validator: function (v) {
        if (v > 0 && v < 6) return v;
      },
      message: (props) => `${props.value} is not a valid rating!`,
    },
  })
  rating: number;
}

export const RestaurantReviewSchema =
  SchemaFactory.createForClass(RestaurantReview);
