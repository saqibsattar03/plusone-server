import { Module } from '@nestjs/common';
import { RestaurantReviewController } from './restaurant-review.controller';
import { RestaurantReviewService } from './restaurant-review.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RestaurantReview,
  RestaurantReviewSchema,
} from '../../data/schemas/restaurantReview.schema';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { SocialPostsModule } from '../social-posts/social-posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RestaurantReview.name,
        schema: RestaurantReviewSchema,
      },
    ]),
    SocialPostsModule,
    RestaurantModule,
  ],
  controllers: [RestaurantReviewController],
  providers: [RestaurantReviewService],
  exports: [RestaurantReviewService],
})
export class RestaurantReviewModule {}
