import { Controller, Delete, Patch, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Body, Get, Post } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  RestaurantDto,
  SingleRestaurantResponseDto,
  UpdateRestaurantDto,
} from '../../../../data/dtos/restaurant.dto';
import { ProfileDto } from '../../../../data/dtos/profile.dto';
import { PaginationDto } from '../../../../common/auth/dto/pagination.dto';
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
    type: SingleRestaurantResponseDto,
    description: 'Single Restaurant in response',
  })
  @ApiQuery({ name: 'restaurantId', type: 'string' })
  @ApiBadRequestResponse({ description: 'can not get Restaurant' })
  getSingleRestaurantDetails(@Query('restaurantId') restaurantId) {
    return this.restaurantService.getSingleRestaurantDetails(restaurantId);
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

  @Patch('')
  @ApiBody({ type: UpdateRestaurantDto })
  @ApiCreatedResponse({
    type: ProfileDto,
    description: 'Edited Restaurant',
  })
  @ApiQuery({ name: 'restaurantId', type: 'string' })
  @ApiBadRequestResponse({
    description: 'can not edit the restaurant',
  })
  editRestaurant(@Query('restaurantId') restaurantId, @Body() data) {
    return this.restaurantService.editRestaurant(restaurantId, data);
  }

  // @Get('nearby')
  // filterCuisines(
  //   @Query('cuisines') cuisine: [],
  //   @Query('tags') tags: [],
  //   @Query('nearest') nearest,
  //   @Query('longitude') longitude,
  //   @Query('latitude') latitude,
  // ) {
  //   return this.restaurantService.nearByCuisineFilter(
  //     cuisine,
  //     tags,
  //     nearest,
  //     longitude,
  //     latitude,
  //   );
  // }
}
