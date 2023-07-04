import {
  Controller,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserStampCardService } from './user-stamp-card.service';
import { Body, Get, Post } from '@nestjs/common/decorators';
import { UserStampCardDto } from '../../data/dtos/userStampCard.dto';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';

@ApiTags('User Stamp Card')
@Controller('user-stamp-card')
export class UserStampCardController {
  constructor(private readonly userStampCardService: UserStampCardService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({
    type: UserStampCardDto,
    description: 'Request body to create a User Stamp Card',
  })
  @ApiCreatedResponse({
    type: UserStampCardDto,
    description: 'return single Stamp Card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create Stamp Card' })
  @UseGuards(JwtAuthGuard)
  createStampCard(@Body() data: UserStampCardDto, @Request() request) {
    data.userId = request.user.userId;
    return this.userStampCardService.createStampCard(data);
  }

  @Get()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: [UserStampCardDto],
    description: 'return array of Stamp Card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create Stamp Card' })
  @UseGuards(JwtAuthGuard)
  getUserStampCards(@Request() request, @Query() paginationDto: PaginationDto) {
    const userId = request.user.userId;
    return this.userStampCardService.getUserStampCards(userId, paginationDto);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiQuery({
    type: String,
    name: 'cardId',
  })
  @ApiQuery({
    type: String,
    name: 'restaurantId',
  })
  @ApiCreatedResponse({
    type: UserStampCardDto,
    description: 'return single Stamp Card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create Stamp Card' })
  @UseGuards(JwtAuthGuard)
  disableUserStampCard(
    @Request() request,
    @Query('cardId') cardId,
    @Query('status') status,
  ) {
    const userId = request.user.userId;
    return this.userStampCardService.userStampCardStatus(
      userId,
      cardId,
      status,
    );
  }

  @Post('/redeem')
  @ApiBearerAuth()
  @ApiQuery({
    type: String,
    name: 'cardId',
  })
  @ApiCreatedResponse({
    type: UserStampCardDto,
    description: 'return single Stamp Card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create Stamp Card' })
  @UseGuards(JwtAuthGuard)
  redeemStampCard(@Query('cardId') cardId, @Request() request) {
    const userId = request.user.userId;
    return this.userStampCardService.redeemStampCard(userId, cardId);
  }
}
