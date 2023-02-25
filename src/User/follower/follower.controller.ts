import { Controller, Param, Patch, Post, Query } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { Get } from '@nestjs/common/decorators';

@Controller('follower')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post('add')
  addFollower(@Query('followerId') followerId, @Query('userId') userId) {
    return this.followerService.addFollower(userId, followerId);
  }
  @Post('remove')
  removeFollower(@Query('followerId') followerId, @Query('userId') userId) {
    return this.followerService.removeFollower(userId, followerId);
  }
  @Get('get-all-followers')
  getAllFollowers(@Query('userId') userId) {
    return this.followerService.getAllFollowers(userId);
  }
}
