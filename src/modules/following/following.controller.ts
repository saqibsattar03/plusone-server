import { Controller, Post, Query } from '@nestjs/common';
import { FollowingService } from './following.service';
import { Get } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Followings')
@Controller('followee')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}
  @Post('add')
  @ApiQuery({ name: 'userId', type: String })
  @ApiQuery({ name: 'followeeId', type: String })
  @ApiResponse({ description: 'Following added Successfully' })
  @ApiBadRequestResponse({
    description: 'could not follow the user',
  })
  addFollowee(@Query('userId') userId, @Query('followeeId') followeeId) {
    return this.followingService.addFollowee(userId, followeeId);
  }

  @Post('remove')
  @ApiQuery({ name: 'userId', type: String })
  @ApiQuery({ name: 'followeeId', type: String })
  @ApiResponse({ description: 'Following removed Successfully' })
  @ApiBadRequestResponse({
    description: 'could not unfollow the user',
  })
  removeFollowee(@Query('userId') userId, @Query('followeeId') followeeId) {
    return this.followingService.removeFollowee(userId, followeeId);
  }

  @Get('get-all-followees')
  @ApiQuery({ name: 'userId', type: String })
  @ApiResponse({ description: 'Following fetched Successfully' })
  @ApiBadRequestResponse({
    description: 'could not fetch the Followings',
  })
  getAllFollowees(@Query('userId') userId) {
    return this.followingService.getAllFollowees(userId);
  }
}
