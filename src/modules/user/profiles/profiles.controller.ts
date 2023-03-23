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
import { Body, Get } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileDto, UpdateProfileDto } from '../../../data/dtos/profile.dto';
import { PaginationDto } from '../../../common/auth/dto/pagination.dto';
import { ViewAuthFilter } from '../../../common/auth/configs/redirect-route.config';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../../../common/auth/guards/jwt-auth.guard';

@ApiTags('Profile')
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Get('')
  @ApiQuery({ name: 'userId', type: String })
  @ApiCreatedResponse({
    type: ProfileDto,
    description: 'user fetched successfully',
  })
  @ApiBadRequestResponse({ description: 'could not fetch the user' })
  getSingleProfile(@Query('userId') userId) {
    return this.profileService.getSingleProfile(userId);
  }

  @Patch('')
  @ApiQuery({ name: 'profileId', type: String })
  @ApiBody({ type: UpdateProfileDto })
  @ApiCreatedResponse({
    type: ProfileDto,
    description: 'Profile updated successfully',
  })
  @ApiBadRequestResponse({ description: 'could not update Profile' })
  async updateProfile(@Query('profileId') profileId, @Body() data) {
    console.log('data = ', data);
    return this.profileService.updateProfile(data, profileId);
  }

  @Delete(':profileId')
  @ApiParam({ name: 'profileId', type: Number })
  @ApiResponse({ description: 'Profile deleted successfully' })
  @ApiBadRequestResponse({ description: 'could not delete Profile' })
  async removeProfile(@Param('profileId') profileId) {
    return this.profileService.removeProfile(profileId);
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
    return this.profileService.getNearByRestaurants(
      cuisine,
      tags,
      nearest,
      longitude,
      latitude,
    );
  }
}
