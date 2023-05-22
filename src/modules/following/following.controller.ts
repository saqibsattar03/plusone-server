import {
  Body,
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
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FollowRequest, FollowResponse } from '../../data/dtos/following.dto';
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

  @Get('get-single')
  @ApiQuery({ type: String, name: 'currentUser' })
  @ApiQuery({ type: String, name: 'searchedUser' })
  @ApiResponse({
    description:
      'it will return if user followed otherwise it will return false',
  })
  SingleUserFollowCheck(
    @Query('currentUser') currentUser,
    @Query('searchedUser') searchedUser,
  ) {
    return this.followingService.SingleUserFollowCheck(
      currentUser,
      searchedUser,
    );
  }
  @Post('remove')
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'followeeId', type: String })
  @ApiResponse({ description: 'Following removed Successfully' })
  @ApiBadRequestResponse({
    description: 'could not unfollow the user',
  })
  // @UseGuards(JwtAuthGuard)
  removeFollowee(@Query('userId') userId, @Query('followeeId') followeeId) {
    return this.followingService.removeFollowee(userId, followeeId);
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
  // @UseGuards(JwtAuthGuard)
  getAllFollowings(@Query('userId') userId) {
    return this.followingService.getAllFollowings(userId);
  }

  @Post('request')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        requestedTo: { type: 'string' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  followRequest(@Body() data, @Request() request) {
    data.requestedFrom = request.user.userId;
    return this.followingService.followRequest(data);
  }
  @Post('change-request-status')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        requestedTo: { type: 'string' },
        status: { type: 'string' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  followRequestStatus(@Body() data, @Request() request) {
    console.log(data);
    data.requestedFrom = request.user.userId;
    return this.followingService.followRequestStatus(data);
  }

  @Get('get-all-request')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: [FollowRequest] })
  @UseGuards(JwtAuthGuard)
  getAllFollowRequest(@Request() request) {
    return this.followingService.getAllFollowRequest(request.user.userId);
  }

  @Post('check-request')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        requestedTo: { type: 'string' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  checkFollowRequest(@Body() data, @Request() request) {
    data.requestedFrom = request.user.userId;
    return this.followingService.checkFollowRequest(data);
  }
}
