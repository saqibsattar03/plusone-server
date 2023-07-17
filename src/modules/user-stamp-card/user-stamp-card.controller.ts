import { Controller, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { UserStampCardService } from './user-stamp-card.service';
import { Body, Get, Post } from '@nestjs/common/decorators';
import {
  StampCardHistoryDto,
  UserStampCardDto,
} from '../../data/dtos/userStampCard.dto';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';

@ApiTags('User Stamp Card')
@Controller('user-stamp-card')
export class UserStampCardController {
  constructor(private readonly userStampCardService: UserStampCardService) {}

  @Post()
  @ApiBody({
    type: UserStampCardDto,
    description: 'Request body to create a user stamp card',
  })
  @ApiCreatedResponse({
    type: UserStampCardDto,
    description: 'return single stamp card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create stamp card' })
  createStampCard(@Body() data: UserStampCardDto) {
    return this.userStampCardService.createStampCard(data);
  }

  @Post('/single')
  @ApiBearerAuth()
  @ApiBody({
    type: UserStampCardDto,
    description: 'Request body to create a user stamp card',
  })
  // @ApiQuery({ type: String, name: 'cardId' })
  @ApiCreatedResponse({
    type: UserStampCardDto,
    description: 'return array of stamp card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create stamp card' })
  // @UseGuards(JwtAuthGuard)
  // getUserSingleStampCard(@Request() request, @Query('cardId') cardId) {
  //   const userId = request.user.userId;
  //   return this.userStampCardService.getUserSingleStampCard(userId, cardId);
  // }
  getUserSingleStampCard(@Body() data: UserStampCardDto) {
    // data.userId = request.user.userId;
    return this.userStampCardService.getUserSingleStampCard(data);
  }
  @Get()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: [UserStampCardDto],
    description: 'return array of stamp card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create stamp card' })
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
    description: 'return single stamp card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create stamp card' })
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cardId: { type: 'string' },
        restaurantId: { type: 'string' },
        uniqueCode: { type: 'number' },
      },
    },
  })
  @ApiCreatedResponse({
    type: UserStampCardDto,
    description: 'return single stamp card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create stamp card' })
  @UseGuards(JwtAuthGuard)
  redeemStampCard(@Body() data, @Request() request) {
    data.userId = request.user.userId;
    return this.userStampCardService.redeemStampCard(data);
  }

  @Patch('/reset')
  @ApiBearerAuth()
  @ApiQuery({
    type: String,
    name: 'cardId',
  })
  @ApiCreatedResponse({
    type: UserStampCardDto,
    description: 'return single stamp card object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create stamp card' })
  @UseGuards(JwtAuthGuard)
  resetStampCard(@Query('cardId') cardId, @Request() request) {
    const userId = request.user.userId;
    return this.userStampCardService.resetStampCard(userId, cardId);
  }

  @Get('/history')
  @ApiBearerAuth()
  @ApiQuery({
    type: String,
    name: 'cardId',
  })
  @ApiResponse({ type: StampCardHistoryDto })
  @ApiBadRequestResponse({ description: 'can not get stamp card history' })
  @UseGuards(JwtAuthGuard)
  getStampCardHistory(@Query('cardId') cardId, @Request() request) {
    return this.userStampCardService.getStampCardHistory(
      request.user.userId,
      cardId,
    );
  }
  @Get('/all-gifts')
  @ApiBearerAuth()
  @ApiResponse({ type: StampCardHistoryDto })
  @ApiBadRequestResponse({ description: 'can not get gifts' })
  @UseGuards(JwtAuthGuard)
  getAwardedGifts(@Request() request) {
    return this.userStampCardService.getAwardedGifts(request.user.userId);
  }
}
