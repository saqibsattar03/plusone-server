import {
  Controller,
  Delete,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Body, Get, Post, Request } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ProfileDto,
  RestaurantFilter,
  UpdateProfileDto,
} from '../../data/dtos/profile.dto';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';
import { RestaurantResponseDto } from '../../data/dtos/restaurant.dto';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';

@ApiTags('Person')
@Controller('persons')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Post('sign-up')
  @ApiBody({
    type: ProfileDto,
    description: 'Users Created as response',
  })
  @ApiBadRequestResponse({ description: 'can not create user' })
  async createUser(@Body() data) {
    return this.profileService.createUser(data);
  }
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @Get('verify-account')
  verifyUser(@Query('confirmationCode') confirmationCode) {
    return this.profileService.verifyUser(confirmationCode);
  }
  @Get('single/:profileId')
  @ApiParam({ name: 'profileId', type: String })
  @ApiCreatedResponse({
    type: ProfileDto,
    description: 'user fetched successfully',
  })
  @ApiBadRequestResponse({ description: 'could not fetch the user' })
  // @UseGuards(JwtAuthGuard)
  getSingleProfile(@Param('profileId') id) {
    return this.profileService.getSingleProfile(id);
  }

  @Patch('update')
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateProfileDto })
  @ApiCreatedResponse({
    type: ProfileDto,
    description: 'Profile updated successfully',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBadRequestResponse({ description: 'could not update Profile' })
  async updateProfile(@Request() request, @Body() data) {
    data.userId = request.user.userId;
    return this.profileService.updateProfile(data);
  }

  @Delete('')
  @ApiResponse({ description: 'Profile deleted successfully' })
  @ApiBadRequestResponse({ description: 'could not delete Profile' })
  // @UseGuards(JwtAuthGuard)
  async removeProfile(@Query('profileId') profileId) {
    return this.profileService.removeProfile(profileId);
  }

  @Get('/all')
  @ApiQuery({ type: String, name: 'role' })
  @ApiResponse({ description: 'All Users  Fetched successfully' })
  @ApiBadRequestResponse({ description: 'could not Fetch  Users' })
  getAllUsers(@Query('role') role) {
    return this.profileService.getAllUsers(role);
  }
  @Get('all-public')
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ description: 'All Public Profile  Fetched successfully' })
  @ApiBadRequestResponse({ description: 'could not Fetch Public Profile' })
  getAllPublicProfile(@Query() paginationQuery: PaginationDto) {
    return this.profileService.getAllPublicProfile(paginationQuery);
  }

  @ApiBody({ type: RestaurantFilter })
  @ApiCreatedResponse({ type: RestaurantResponseDto })
  @Post('near-by-restaurants')
  getNearByRestaurants(@Body() data, @Query() paginationQuery: PaginationDto) {
    return this.profileService.restaurantFilters(data, paginationQuery);
  }

  @Patch('update-password')
  @ApiBearerAuth('access-token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
  })
  @ApiResponse({ description: 'password updated successfully' })
  @ApiBadRequestResponse({ description: 'could not update  password' })
  @UseGuards(JwtAuthGuard)
  changePassword(@Request() request, @Body() data) {
    data.userId = request.user.userId;
    return this.profileService.changePassword(data);
  }

  /*** temporary route ***/
  @ApiQuery({ name: 'userId', type: String })
  @Patch('change-status')
  changeUserStatus(@Query('userId') userId) {
    return this.profileService.changeUserStatus(userId);
  }

  @Get('search-by-name')
  @ApiQuery({ name: 'username', type: String })
  @ApiCreatedResponse({
    schema: {
      properties: {
        _id: { type: 'string' },
        username: { type: 'string' },
        firstname: { type: 'string' },
        surname: { type: 'string' },
        profileImage: { type: 'string' },
      },
    },
  })
  filterUserByName(@Query('username') username) {
    return this.profileService.filterUserByName(username);
  }
}
