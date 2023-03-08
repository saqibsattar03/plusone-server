import { Controller, Query } from '@nestjs/common';
import { FilterService } from './filter.service';
import { Get } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Filters')
@Controller('filter')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}
  @Get('cuisine')
  filterCuisines(@Query('cuisines') cuisine: []) {
    return this.filterService.filterCuisines(cuisine);
  }

  @Get('caption')
  filterRestaurantBasedOnCaption(@Query('keyword') keyword) {
    return this.filterService.filterRestaurantBasedOnCaption(keyword);
  }
}
