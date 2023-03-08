import { Controller, Delete, Param, Patch, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Body, Get, Post } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDTO } from '../../social-posts/dto/create-post.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { CreateProfileDto } from '../../User/profiles/dto/create-profile.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
@ApiTags('Restaurants')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('create')
  @ApiBody({
    type: CreateRestaurantDto,
    description: 'Request body to create a Restaurant',
  })
  @ApiCreatedResponse({
    type: CreateRestaurantDto,
    description: 'Created Restaurant object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create Restaurant' })
  createRestaurant(@Body() data) {
    return this.restaurantService.createRestaurant(data);
  }

  @Get('get-all')
  @ApiCreatedResponse({
    type: CreateRestaurantDto,
    description: 'Restaurant List in response',
  })
  @ApiBadRequestResponse({ description: 'can not get Restaurants' })
  getAllRestaurants() {
    return this.restaurantService.getAllRestaurants();
  }

  @Get('')
  @ApiCreatedResponse({
    type: CreateRestaurantDto,
    description: 'Single Restaurant in response',
  })
  @ApiQuery({ name: 'restaurantId', type: 'string' })
  @ApiBadRequestResponse({ description: 'can not get Restaurant' })
  getRestaurantById(@Query('restaurantId') restaurantId) {
    return this.restaurantService.getRestaurantById(restaurantId);
  }

  @Get('all-users-redeemed-voucher')
  @ApiCreatedResponse({
    type: CreateProfileDto,
    description: 'All Users',
  })
  @ApiQuery({ name: 'voucherId', type: 'string' })
  @ApiBadRequestResponse({
    description: 'can not get users who redeemed the voucher',
  })
  getUserWhoRedeemVoucher(@Query('voucherId') voucherId) {
    return this.restaurantService.getUserWhoRedeemVoucher(voucherId);
  }

  @Patch('')
  @ApiBody({ type: UpdateRestaurantDto })
  @ApiCreatedResponse({
    type: CreateProfileDto,
    description: 'Edited Restaurant',
  })
  @ApiQuery({ name: 'restaurantId', type: 'string' })
  @ApiBadRequestResponse({
    description: 'can not edit the restaurant',
  })
  editRestaurant(@Query('restaurantId') restaurantId, @Body() data) {
    return this.restaurantService.editRestaurant(restaurantId, data);
  }

  @Delete('remove')
  @ApiCreatedResponse({
    description: 'Restaurant Removed Successfully',
  })
  @ApiQuery({ name: 'restaurantId', type: 'string' })
  @ApiBadRequestResponse({
    description: 'can not remove the restaurant',
  })
  deleteRestaurant(@Query('restaurantId') restaurantId) {
    return this.restaurantService.deleteRestaurant(restaurantId);
  }
}
