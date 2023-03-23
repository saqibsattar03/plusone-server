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
import { RestaurantDto } from './dto/create-restaurant.dto';
import { CreateProfileDto } from '../../../User/profiles/dto/create-profile.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { GetAllRestaurantDto } from './dto/get-all-restaurant.dto';
import { GetSingleRestaurantDto } from './dto/get-single-restaurant.dto';
@ApiTags('Restaurants')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('create')
  @ApiBody({
    type: RestaurantDto,
    description: 'Request body to create a Restaurant',
  })
  @ApiCreatedResponse({
    type: RestaurantDto,
    description: 'Created Restaurant object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create Restaurant' })
  createRestaurant(@Body() data) {
    console.log(data);
    return this.restaurantService.createRestaurant(data);
  }

  @Get('get-all')
  @ApiCreatedResponse({
    type: RestaurantDto,
    description: 'Restaurant List in response',
  })
  @ApiQuery({ name: 'limit', type: 'number' })
  @ApiQuery({ name: 'offset', type: 'number' })
  @ApiBadRequestResponse({ description: 'can not get Restaurants' })
  getAllRestaurants(@Query() paginationQuery: PaginationDto) {
    return this.restaurantService.getAllRestaurants(paginationQuery);
  }

  @Get('')
  @ApiCreatedResponse({
    type: GetSingleRestaurantDto,
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

  @Patch('update-status')
  @ApiCreatedResponse({
    description: 'Restaurant Status updated',
  })
  @ApiQuery({ name: 'restaurantId', type: 'string' })
  @ApiQuery({ name: 'status', type: 'string' })
  @ApiBadRequestResponse({
    description: 'could not update restaurant status',
  })
  changeRestaurantStatus(
    @Query('restaurantId') restaurantId,
    @Query('status') status,
  ) {
    return this.restaurantService.changeRestaurantStatus(restaurantId, status);
  }
  @Get('get-vouchers')
  getRestaurantVouchers(@Query('restaurantId') restaurantId) {
    return this.restaurantService.getRestaurantVouchers(restaurantId);
  }
  @Get('get-reviews')
  getRestaurantReviews(@Query('restaurantId') restaurantId) {
    return this.restaurantService.getRestaurantReviews(restaurantId);
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
