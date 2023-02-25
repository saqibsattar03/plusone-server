import { Controller, Delete, Patch, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Body, Post } from '@nestjs/common/decorators';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('create')
  createRestaurant(@Body() data) {
    return this.restaurantService.createRestaurant(data);
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
