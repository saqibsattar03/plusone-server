import {
  Controller,
  Delete,
  Param,
  Patch,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Body, Get, Post, Request } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileDto, UpdateProfileDto } from '../../data/dtos/profile.dto';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';
import * as bcrypt from 'bcrypt';
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
    const saltOrRounds = 10;
    data.password = await bcrypt.hash(data.password, saltOrRounds);
    return this.profileService.createUser(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-account')
  verifyUser(@Request() request) {
    return this.profileService.verifyUser(request.user.confirmationCode);
  }

  @Get(':id')
  @ApiParam({ name: 'userId', type: String })
  @ApiCreatedResponse({
    type: ProfileDto,
    description: 'user fetched successfully',
  })
  @ApiBadRequestResponse({ description: 'could not fetch the user' })
  // @UseGuards(JwtAuthGuard)
  getSingleProfile(@Param('id') id) {
    return this.profileService.getSingleProfile(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateProfileDto })
  @ApiCreatedResponse({
    type: ProfileDto,
    description: 'Profile updated successfully',
  })
  @ApiBadRequestResponse({ description: 'could not update Profile' })
  async updateProfile(@Param('id') profileId, @Body() data) {
    return this.profileService.updateProfile(data, profileId);
  }

  @Delete('')
  @ApiResponse({ description: 'Profile deleted successfully' })
  @ApiBadRequestResponse({ description: 'could not delete Profile' })
  @UseGuards(JwtAuthGuard)
  async removeProfile(@Request() request) {
    return this.profileService.removeProfile(request.user.userId);
  }

  @Get('all')
  @ApiQuery({ type: String, name: 'role' })
  @ApiResponse({ description: 'All Users  Fetched successfully' })
  @ApiBadRequestResponse({ description: 'could not Fetch  Users' })
  getAllUsers() {
    return this.profileService.getAllUsers();
  }
  @Get('merchants')
  @ApiResponse({ description: 'All Merchants  Fetched successfully' })
  @ApiBadRequestResponse({ description: 'could not Fetch  Merchant' })
  getAllMerchants() {
    return this.profileService.getAllMerchants();
  }

  @Get('admins')
  @ApiResponse({ description: 'All Admins  Fetched successfully' })
  @ApiBadRequestResponse({ description: 'could not Fetch  Admins' })
  getAllAdmins() {
    return this.profileService.getAllAdmins();
  }
  @Get('all-public')
  @ApiResponse({ description: 'All Public Profile  Fetched successfully' })
  @ApiBadRequestResponse({ description: 'could not Fetch Public Profile' })
  getAllPublicProfile(@Query() paginationQuery: PaginationDto) {
    return this.profileService.getAllPublicProfile(paginationQuery);
  }

  @Get('near-by-restaurants')
  getNearByRestaurants(
    @Query('cuisines') cuisine: [],
    @Query('tags') tags: [],
    @Query('nearest') nearest,
    @Query('longitude') longitude,
    @Query('latitude') latitude,
  ) {
    return this.profileService.restaurantFilters(
      cuisine,
      tags,
      nearest,
      longitude,
      latitude,
    );
  }

  @Patch('update-password')
  changePassword(
    @Query('email') email,
    @Query('oldPassword') oldPassword,
    @Query('newPassword') newPassword,
  ) {
    return this.profileService.changePassword(email, oldPassword, newPassword);
  }
}
