import { forwardRef, Module } from '@nestjs/common';
import { RestaurantReviewController } from './restaurant-review.controller';
import { RestaurantReviewService } from './restaurant-review.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RestaurantReview,
  RestaurantReviewSchema,
} from '../../data/schemas/restaurantReview.schema';
import { Profile, ProfileSchema } from '../../data/schemas/profile.schema';
import {
  Restaurant,
  RestaurantSchema,
} from '../../data/schemas/restaurant.schema';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RestaurantReview.name,
        schema: RestaurantReviewSchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
    RestaurantModule,
  ],
  controllers: [RestaurantReviewController],
  providers: [RestaurantReviewService],
  exports: [RestaurantReviewService],
})
export class RestaurantReviewModule {}
