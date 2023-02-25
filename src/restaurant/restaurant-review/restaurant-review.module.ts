import { Module } from '@nestjs/common';
import { RestaurantReviewController } from './restaurant-review.controller';
import { RestaurantReviewService } from './restaurant-review.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RestaurantReview,
  RestaurantReviewSchema,
} from '../../Schemas/restaurantReview.schema';
import { Profile, ProfileSchema } from '../../Schemas/Profile.schema';

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
  ],
  controllers: [RestaurantReviewController],
  providers: [RestaurantReviewService],
})
export class RestaurantReviewModule {}
