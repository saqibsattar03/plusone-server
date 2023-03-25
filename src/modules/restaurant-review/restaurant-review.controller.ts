import { Body, Controller, Delete, Patch, Post, Query } from '@nestjs/common';
import { RestaurantReviewService } from './restaurant-review.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  RestaurantReviewDto,
  UpdateReviewDto,
} from '../../data/dtos/restaurant.dto';
import { Get } from '@nestjs/common/decorators';

@ApiTags('Restaurant Reviews')
@Controller('review')
export class RestaurantReviewController {
  constructor(
    private readonly restaurantReviewService: RestaurantReviewService,
  ) {}

  @Post('')
  @ApiBody({
    type: RestaurantReviewDto,
    description: 'Request body to create a review',
  })
  @ApiCreatedResponse({
    type: RestaurantReviewDto,
    description: 'Created review object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create review' })
  createReview(@Body() data) {
    console.log('here');
    return this.restaurantReviewService.createReview(data);
  }

  @Patch('')
  @ApiBody({ type: UpdateReviewDto })
  @ApiCreatedResponse({
    type: RestaurantReviewDto,
    description: 'Review Edit Successfully',
  })
  @ApiQuery({ name: 'restaurantId', type: 'string' })
  @ApiBadRequestResponse({
    description: 'can not edit the review',
  })
  editReview(@Body() data, @Query('restaurantId') restaurantId) {
    console.log(restaurantId);
    return this.restaurantReviewService.editReview(data, restaurantId);
  }

  @Delete('')
  deleteSingleReview(
    @Query('reviewId') reviewId,
    @Query('restaurantId') restaurantId,
  ) {
    return this.restaurantReviewService.deleteSingleReview(
      reviewId,
      restaurantId,
    );
  }

  @Delete('all')
  deleteAllReviews(@Query('restaurantId') restaurantId) {
    return this.restaurantReviewService.deleteAllReviews(restaurantId);
  }

  @ApiCreatedResponse({
    type: RestaurantReviewDto,
    description: 'Review Fetched Successfully',
  })
  @ApiQuery({ name: 'restaurantId', type: 'string' })
  @ApiBadRequestResponse({
    description: 'can not fetch all review',
  })
  @Get('all')
  getRestaurantReviews(@Query('restaurantId') restaurantId) {
    return this.restaurantReviewService.getRestaurantReviews(restaurantId);
  }
}