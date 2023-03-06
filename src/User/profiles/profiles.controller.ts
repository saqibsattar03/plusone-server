import {
  Controller,
  Delete,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Body, Get, Res, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidation } from '../../common/image.config';

@Controller('profile')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Get('get-single-user')
  getSingleProfile(@Query('userId') userId) {
    return this.profileService.getSingleProfile(userId);
  }

  @Get('get-nearby-restaurant')
  getNearByRestaurant(
    @Query('longitude') longitude,
    @Query('latitude') latitude,
  ) {
    return this.profileService.getNearByRestaurant(longitude, latitude);
  }

  @Patch('update/:profileId')
  @UseInterceptors(FileInterceptor('media', imageValidation))
  async updateProfile(
    @Param('profileId') profileId,
    @Body() data,
    @Res() res,
    @UploadedFile() media,
  ) {
    const filename = media.originalname.trim();
    const filePath = media.path;
    const fileInfo = {
      fileName: filename,
      filePath: filePath,
    };
    data.profileImage = fileInfo.filePath;
    const profile = await this.profileService.updateProfile(data, profileId);
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

  @Get('all-public')
  getAllPublicProfile() {
    return this.profileService.getAllPublicProfile();
  }
}
