import { Body, Controller, Delete, Patch, Post, Query } from '@nestjs/common';
import { RestaurantReviewService } from './restaurant-review.service';

@Controller('review')
export class RestaurantReviewController {
  constructor(
    private readonly restaurantReviewService: RestaurantReviewService,
  ) {}

  @Post('create')
  createReview(@Body() data) {
    return this.restaurantReviewService.createReview(data);
  }

  @Patch('edit')
  editReview(@Body() data, @Query('restaurantId') restaurantId) {
    return this.restaurantReviewService.editReview(data, restaurantId);
  }

  @Delete('remove')
  deleteReview(
    @Query('reviewId') reviewId,
    @Query('restaurantId') restaurantId,
  ) {
    return this.restaurantReviewService.deleteReview(reviewId, restaurantId);
  }
}
