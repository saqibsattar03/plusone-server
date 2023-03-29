import { Controller, Patch, Query, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Body, Get, Post, Request } from '@nestjs/common/decorators';
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
} from '../../data/dtos/restaurant.dto';
import { ProfileDto } from '../../data/dtos/profile.dto';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
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
  // @UseGuards(JwtAuthGuard)
  createRestaurant(@Body() data) {
    console.log(data);
    // data.userId = request.user.userId;
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

  @Get('details')
  @ApiCreatedResponse({
    type: SingleRestaurantResponseDto,
    description: 'Single Restaurant in response',
  })
  @ApiQuery({ name: 'restaurantId', type: 'string' })
  @ApiBadRequestResponse({ description: 'can not get Restaurant' })
  getSingleRestaurantDetails(@Query('restaurantId') restaurantId) {
    return this.restaurantService.getSingleRestaurantDetails(restaurantId);
  }

  @Get('profile')
  @ApiCreatedResponse({
    type: SingleRestaurantResponseDto,
    description: 'Single Restaurant in response',
  })
  @ApiQuery({ name: 'restaurantId', type: 'string' })
  @ApiBadRequestResponse({ description: 'can not get Restaurant' })
  getRestaurantProfile(@Query('restaurantId') restaurantId) {
    return this.restaurantService.getRestaurantProfile(restaurantId);
  }
  // @Patch('update-status')
  // @ApiCreatedResponse({
  //   description: 'Restaurant Status updated',
  // })
  // @ApiQuery({ name: 'restaurantId', type: 'string' })
  // @ApiQuery({ name: 'status', type: 'string' })
  // @ApiBadRequestResponse({
  //   description: 'could not update restaurant status',
  // })
  // @UseGuards(JwtAuthGuard)
  // changeRestaurantStatus(@Request() request, @Body('status') status) {
  //   return this.restaurantService.changeRestaurantStatus(
  //     request.user.userId,
  //     status,
  //   );
  // }

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
  @Get('dietary-Restrictions')
  dietFilter(@Query('dietaryRestrictions') dietaryRestrictions: [string]) {
    return this.restaurantService.dietFilter(dietaryRestrictions);
  }

  @Get('popular')
  filterPopularRestaurant() {
    return this.restaurantService.filterPopularRestaurant();
  }
}
