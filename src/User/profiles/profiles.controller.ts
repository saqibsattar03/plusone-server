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
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ViewAuthFilter } from '../../auth/configs/redirect-route.config';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Profile')
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Get('')
  @ApiQuery({ name: 'userId', type: String })
  @ApiCreatedResponse({
    type: CreateProfileDto,
    description: 'User fetched successfully',
  })
  @ApiBadRequestResponse({ description: 'could not fetch the user' })
  getSingleProfile(@Query('userId') userId) {
    return this.profileService.getSingleProfile(userId);
  }

  @Patch('')
  @ApiQuery({ name: 'profileId', type: String })
  @ApiBody({ type: UpdateProfileDto })
  @ApiCreatedResponse({
    type: CreateProfileDto,
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
}
