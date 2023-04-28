import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FollowingService } from './following.service';
import { Get, Request } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FollowResponse } from '../../data/dtos/following.dto';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';

@ApiTags('Followings')
@Controller('followee')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}
  @Post('add')
  // @ApiQuery({ name: 'userId', type: String })
  @ApiQuery({ name: 'followeeId', type: String })
  @ApiResponse({ description: 'Following added Successfully' })
  @ApiBadRequestResponse({
    description: 'could not follow the user',
  })
  @UseGuards(JwtAuthGuard)
  addFollowee(@Request() request, @Query('followeeId') followeeId) {
    if (request.user.userId == followeeId)
      throw new HttpException(
        'you can not follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    return this.followingService.addFollowee(request.user.userId, followeeId);
  }

  @Post('remove')
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'followeeId', type: String })
  @ApiResponse({ description: 'Following removed Successfully' })
  @ApiBadRequestResponse({
    description: 'could not unfollow the user',
  })
  @UseGuards(JwtAuthGuard)
  removeFollowee(@Request() request, @Query('followeeId') followeeId) {
    console.log('user Id = ', request.user.userId);
    return this.followingService.removeFollowee(
      request.user.userId,
      followeeId,
    );
  }

  @Get('all')
  @ApiQuery({ name: 'userId', type: String })
  @ApiResponse({
    type: [FollowResponse],
    description: 'Following fetched Successfully',
  })
  @ApiBadRequestResponse({
    description: 'could not fetch the Followings',
  })
  @UseGuards(JwtAuthGuard)
  getAllFollowings(@Request() request) {
    return this.followingService.getAllFollowings(request.user.userId);
  }
}
