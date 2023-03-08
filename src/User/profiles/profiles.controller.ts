import {
  Controller,
  Delete,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Body, Get, Res } from '@nestjs/common/decorators';
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

  @Get('get-nearby-restaurant')
  @ApiQuery({ name: 'longitude', type: Number })
  @ApiQuery({ name: 'latitude', type: Number })
  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    description: 'could not fetch the list of nearby restaurant',
  })
  getNearByRestaurant(
    @Query('longitude') longitude,
    @Query('latitude') latitude,
  ) {
    return this.profileService.getNearByRestaurant(longitude, latitude);
  }

  @Patch('update')
  @ApiQuery({ name: 'profileId', type: String })
  @ApiBody({ type: UpdateProfileDto })
  @ApiCreatedResponse({
    type: CreateProfileDto,
    description: 'Profile updated successfully',
  })
  @ApiBadRequestResponse({ description: 'could not update Profile' })
  async updateProfile(@Query('profileId') profileId, @Body() data) {
    return this.profileService.updateProfile(data, profileId);
  }

  @Delete(':profileId')
  @ApiParam({ name: 'profileId', type: Number })
  @ApiResponse({ description: 'Profile deleted successfully' })
  @ApiBadRequestResponse({ description: 'could not delete Profile' })
  async removeProfile(@Param('profileId') profileId, @Res() res) {
    const profile = await this.profileService.removeProfile(profileId);
    if (!profile) throw new NotFoundException(' Profile does not exist');
    return res.status(HttpStatus.OK).json({
      message: 'profile deleted successfully',
      profile,
    });
  }

  @Get('all-public')
  @ApiResponse({ description: 'All Public Profile  Fetched successfully' })
  @ApiBadRequestResponse({ description: 'could not Fetch Public Profile' })
  getAllPublicProfile() {
    return this.profileService.getAllPublicProfile();
  }
}
