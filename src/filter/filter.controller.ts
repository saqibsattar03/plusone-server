import { Controller, Query } from '@nestjs/common';
import { FilterService } from './filter.service';
import { Get } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Filters')
@Controller('filter')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}
  @Get('cuisine')
  filterCuisines(
    @Query('cuisines') cuisine: [],
    @Query('tags') tags: [],
    @Query('nearest') nearest,
    @Query('longitude') longitude,
    @Query('latitude') latitude,
  ) {
    return this.filterService.nearByCuisineFilter(
      cuisine,
      tags,
      nearest,
      longitude,
      latitude,
    );
  }

  @Get('caption')
  filterRestaurantBasedOnCaption(@Query('keyword') keyword) {
    return this.filterService.filterRestaurantBasedOnCaption(keyword);
  }

  @Get('get-nearby-restaurant')
  @ApiQuery({ name: 'longitude', type: Number })
  @ApiQuery({ name: 'latitude', type: Number })
  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    description: 'could not fetch the list of nearby restaurant',
  })
  filterNearByRestaurant(
    @Query('longitude') longitude,
    @Query('latitude') latitude,
  ) {
    return this.filterService.filterNearByRestaurant(longitude, latitude);
  }
  @Get('popular-restaurants')
  filterPopularRestaurant() {
    return this.filterService.filterPopularRestaurant();
  }

  @Get('dietary-Restrictions')
  dietFilter(@Query('dietaryRestrictions') dietaryRestrictions: [string]) {
    return this.filterService.dietFilter(dietaryRestrictions);
  }
}
