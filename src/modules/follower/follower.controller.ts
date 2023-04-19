import { Controller, Post, Query } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { Get } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FollowResponse } from '../../data/dtos/following.dto';

@ApiTags('Followers')
@Controller('follower')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post('add')
  @ApiQuery({ name: 'userId', type: String })
  @ApiQuery({ name: 'followerId', type: String })
  @ApiResponse({ description: 'Follower added Successfully' })
  @ApiBadRequestResponse({
    description: 'could not follow the user',
  })
  addFollower(@Query('followerId') followerId, @Query('userId') userId) {
    return this.followerService.addFollower(userId, followerId);
  }
  @Post('remove')
  @ApiQuery({ name: 'userId', type: String })
  @ApiQuery({ name: 'followerId', type: String })
  @ApiResponse({ description: 'Follower removed Successfully' })
  @ApiBadRequestResponse({
    description: 'could not unfollow the user',
  })
  removeFollower(@Query('followerId') followerId, @Query('userId') userId) {
    return this.followerService.removeFollower(userId, followerId);
  }
  @Get('all')
  @ApiQuery({ name: 'userId', type: String })
  @ApiResponse({
    type: [FollowResponse],
    description: 'Following fetched Successfully',
  })
  @ApiBadRequestResponse({
    description: 'could not fetch the Followers',
  })
  getAllFollowers(@Query('userId') userId) {
    return this.followerService.getAllFollowers(userId);
  }
}
