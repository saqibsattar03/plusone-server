import {
  Controller,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { Get, UploadedFiles, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { imageValidation } from './common/image.config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Main')
@Controller()
export class AppController {
  @Get('/')
  get() {
    return 'hello world';
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('media', imageValidation))
  async uploadProfileImage(
    @UploadedFile() media: Express.Multer.File,
  ): Promise<any> {
    if (media) {
      return media.filename;
    }
    throw new HttpException('no image uploaded', HttpStatus.NOT_FOUND);
  }

  @Post('upload-multiple-image')
  @UseInterceptors(FilesInterceptor('media', 5, imageValidation))
  async uploadMultipleProfileImage(
    @UploadedFiles() media: Array<Express.Multer.File>,
  ): Promise<any> {
    if (media.length > 0) {
      const name = [];
      for (let i = 0; i < media.length; i++) {
        name.push(media[i].filename);
      }
      return name;
    }
    throw new HttpException('no image uploaded', HttpStatus.NOT_FOUND);
  }
  // @Delete('remove-profile-pic')
  // async removeProfileImage(imageName: string): Promise<any> {
  //   return u;
  // }
}
