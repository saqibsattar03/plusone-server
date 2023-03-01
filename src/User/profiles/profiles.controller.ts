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
import { Body, Get, Post, Res } from '@nestjs/common/decorators';

@Controller('profile')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}
  @Post('create')
  createProfile(@Body() data) {
    return this.profileService.createProfile(data);
  }

  @Get('get-single-user')
  getSingleProfile(@Query('userId') userId) {
    return this.profileService.getSingleProfile(userId);
  }

  @Patch('update/:profileId')
  async updateProfile(@Param('profileId') profileId, @Body() data, @Res() res) {
    const profile = await this.profileService.updateProfile(data, profileId);
    console.log('profile = ', profile);
    if (!profile) throw new NotFoundException(' Profile does not exist');
    return res.status(HttpStatus.OK).json({
      message: 'profile updated successfully',
      profile,
    });
  }

  @Delete('remove/:profileId')
  async removeProfile(@Param('profileId') profileId, @Res() res) {
    const profile = await this.profileService.removeProfile(profileId);
    if (!profile) throw new NotFoundException(' Profile does not exist');
    return res.status(HttpStatus.OK).json({
      message: 'profile deleted successfully',
      profile,
    });
  }

  @Post('redeem-restaurant')
  redeemedRestaurants(
    @Query('userId') userId,
    @Query('restaurantId') restaurantId,
    @Query('voucherId') voucherId,
  ) {
    return this.profileService.redeemedRestaurants(
      userId,
      restaurantId,
      voucherId,
    );
  }
}
