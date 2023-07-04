import { Controller, Delete, Param, Patch, Query } from '@nestjs/common';
import { StampCardService } from './stamp-card.service';
import { Body, Get, Post } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RestaurantStampCardDto } from '../../data/dtos/restaurantStampCard.dto';
import mongoose from 'mongoose';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';

@ApiTags('Restaurant Stamp Card')
@Controller('restaurant-stamp-card')
export class StampCardController {
  constructor(private readonly stampCardService: StampCardService) {}

  @Post()
  @ApiBody({
    type: RestaurantStampCardDto,
    description: 'Request body to create a Stamp Card',
  })
  @ApiCreatedResponse({
    type: RestaurantStampCardDto,
    description: 'Created Stamp Card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create Stamp Card' })
  createStampCard(@Body() data) {
    data.restaurantId = new mongoose.Types.ObjectId(data.restaurantId);
    return this.stampCardService.createStampCard(data);
  }

  @Get('/:cardId')
  @ApiParam({ type: String, name: 'cardId' })
  @ApiCreatedResponse({
    type: RestaurantStampCardDto,
    description: 'return single Stamp Card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not return Stamp Card' })
  getSingleStampCard(@Param('cardId') cardId) {
    return this.stampCardService.getSingleStampCard(cardId);
  }

  @Get('/all/:restaurantId')
  @ApiParam({ type: String, name: 'restaurantId' })
  @ApiCreatedResponse({
    type: [RestaurantStampCardDto],
    description: 'return Array of Stamp Card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not return Stamp Card' })
  getAllStampCards(
    @Query() paginationDto: PaginationDto,
    @Param('restaurantId') restaurantId,
  ) {
    return this.stampCardService.getAllStampCards(paginationDto, restaurantId);
  }

  @Patch()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cardId: { type: 'string' },
        totalPoint: { type: 'number' },
        reward: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({
    type: RestaurantStampCardDto,
    description: 'return updated Stamp Card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not update Stamp Card' })
  editStampCard(@Body() data) {
    return this.stampCardService.editStampCard(data.cardId, data);
  }

  @Delete('/:id')
  @ApiParam({ type: String, name: 'id' })
  @ApiCreatedResponse({
    type: RestaurantStampCardDto,
    description: 'return deleted Stamp Card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not delete Stamp Card' })
  deleteStampCard(@Param('id') id) {
    return this.stampCardService.deleteStampCard(id);
  }
}
