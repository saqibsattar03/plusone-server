import {
  Controller,
  Post,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FollowerService } from './follower.service';
import { Get } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FollowResponse } from '../../data/dtos/following.dto';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  addFollower(@Query('followerId') followerId, @Request() request) {
    if (request.user.userId == followerId)
      throw new HttpException(
        'you can not follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    return this.followerService.addFollower(request.user.userId, followerId);
  }
  @Post('remove')
  @ApiQuery({ name: 'userId', type: String })
  @ApiQuery({ name: 'followerId', type: String })
  @ApiResponse({ description: 'Follower removed Successfully' })
  @ApiBadRequestResponse({
    description: 'could not unfollow the user',
  })
  @UseGuards(JwtAuthGuard)
  removeFollower(@Query('followerId') followerId, @Request() request) {
    return this.followerService.removeFollower(request.user.userId, followerId);
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
  // @UseGuards(JwtAuthGuard)
  getAllFollowers(@Query('userId') userId) {
    return this.followerService.getAllFollowers(userId);
  }
}
