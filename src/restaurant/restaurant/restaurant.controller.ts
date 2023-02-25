import { Controller, Delete, Param, Patch, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Body, Get, Post } from '@nestjs/common/decorators';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('create')
  createRestaurant(@Body() data) {
    return this.restaurantService.createRestaurant(data);
  }

  @Get('get-all')
  getAllRestaurants() {
    return this.restaurantService.getAllRestaurants();
  }

  @Get('/:restaurantId')
  getRestaurantById(@Param('restaurantId') restaurantId) {
    return this.restaurantService.getRestaurantById(restaurantId);
  }

  @Patch('edit')
  editRestaurant(@Query('restaurantId') restaurantId, @Body() data) {
    return this.restaurantService.editRestaurant(restaurantId, data);
  }

  @Delete('remove')
  deleteRestaurant(@Query('restaurantId') restaurantId) {
    return this.restaurantService.deleteRestaurant(restaurantId);
  }
}
