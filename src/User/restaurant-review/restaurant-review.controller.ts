import { Body, Controller, Delete, Patch, Post, Query } from '@nestjs/common';
import { RestaurantReviewService } from './restaurant-review.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDTO } from '../social-posts/dto/create-post.dto';
import { CreateRestaurantReviewDto } from './dto/CreateRestaurantReviewDto.dto';
import { UpdateRestaurantDto } from '../../Admin/restaurant/restaurant/dto/update-restaurant.dto';
import { CreateProfileDto } from '../profiles/dto/create-profile.dto';
import { UpdateReviewDto } from './dto/UpdateReview.dto';

@ApiTags('Restaurant Reviews')
@Controller('review')
export class RestaurantReviewController {
  constructor(
    private readonly restaurantReviewService: RestaurantReviewService,
  ) {}

  @Post('create')
  @ApiBody({
    type: CreateRestaurantReviewDto,
    description: 'Request body to create a review',
  })
  @ApiCreatedResponse({
    type: CreateRestaurantReviewDto,
    description: 'Created review object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create review' })
  createReview(@Body() data) {
    return this.restaurantReviewService.createReview(data);
  }

  @Patch('')
  @ApiBody({ type: UpdateReviewDto })
  @ApiCreatedResponse({
    type: CreateRestaurantReviewDto,
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

  @Delete('remove')
  deleteReview(
    @Query('reviewId') reviewId,
    @Query('restaurantId') restaurantId,
  ) {
    return this.restaurantReviewService.deleteReview(reviewId, restaurantId);
  }
}
