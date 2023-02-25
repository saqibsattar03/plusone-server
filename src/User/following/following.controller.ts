import { Controller, Post, Query } from '@nestjs/common';
import { FollowingService } from './following.service';
import { Get } from '@nestjs/common/decorators';

@Controller('followee')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}
  @Post('add')
  addFollowee(@Query('userId') userId, @Query('followeeId') followeeId) {
    return this.followingService.addFollowee(userId, followeeId);
  }

  @Post('remove')
  removeFollowee(@Query('userId') userId, @Query('followeeId') followeeId) {
    return this.followingService.removeFollowee(userId, followeeId);
  }

  @Get('get-all-followees')
  getAllFollowees(@Query('userId') userId) {
    return this.followingService.getAllFollowees(userId);
  }
}
