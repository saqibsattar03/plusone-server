import { Controller, Param, Patch, Query } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { Body, Get, Post } from '@nestjs/common/decorators';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';
import { FcmDto } from '../../data/dtos/fcm.dto';

@ApiTags('Fcm')
@Controller('fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  @Post('/send-single')
  sendSingleNotification(@Body() data) {
    return this.fcmService.sendSingleNotification(data);
  }

  @Post('/send-all')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userIds: { type: 'array', items: { type: 'string' } },
        title: { type: 'string' },
        body: { type: 'string' },
      },
    },
  })
  sendNotificationToMultipleUsers(@Body() data) {
    return this.fcmService.sendNotificationToMultipleUsers(data);
  }

  @Patch('/token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        token: { type: 'string' },
      },
    },
  })
  updateFcmToken(@Body() data) {
    return this.fcmService.updateFcmToken(data);
  }
  @Get('/get-history/:id')
  @ApiParam({ type: String, name: 'id' })
  // @ApiQuery({ type: PaginationDto })
  @ApiResponse({ type: [FcmDto] })
  getHistory(@Query() paginationDto: PaginationDto, @Param('id') id: string) {
    return this.fcmService.userHistory(id, paginationDto);
  }
  @Get('/get-unseen/:id')
  @ApiParam({ type: String, name: 'id' })
  userUnseenHistory(@Param('id') id) {
    return this.fcmService.userUnseenHistory(id);
  }
  @Patch('/unseen-to-seen/:id')
  unsSeenToSeenHistory(@Param('id') id) {
    return this.fcmService.unSeenToSeenHistory(id);
  }
}
