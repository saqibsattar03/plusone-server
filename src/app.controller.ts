import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import {
  Get,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { imageValidation } from './common/image.config';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Main')
@Controller()
export class AppController {
  @Get('/')
  get() {
    return 'hello world';
  }

  @Post('single-file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        media: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: String, description: 'uploaded file name' })
  @ApiBadRequestResponse({ description: 'could not upload file' })
  @UseInterceptors(FileInterceptor('media', imageValidation))
  async uploadProfileImage(
    @UploadedFile() media: Express.Multer.File,
  ): Promise<any> {
    if (media) {
      return media.filename;
    }
    throw new HttpException('no image uploaded', HttpStatus.NOT_FOUND);
  }

  @Post('multiple-files')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        media: {
          type: 'array', //   array of files
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({ type: String, description: 'uploaded file names' })
  @ApiBadRequestResponse({ description: 'could not upload files' })
  @UseInterceptors(FilesInterceptor('media', 5, imageValidation))
  async uploadMultipleProfileImage(
    @UploadedFiles() media: Array<Express.Multer.File>,
  ): Promise<any> {
    if (media.length > 0) {
      const names = [];
      for (let i = 0; i < media.length; i++) {
        names.push(media[i].filename);
      }
      return names;
    }
    throw new HttpException('no image uploaded', HttpStatus.NOT_FOUND);
  }

  @Get('singe-file')
  @ApiQuery({ name: 'file', type: String })
  @ApiResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
    status: HttpStatus.OK,
  })
  @ApiBadRequestResponse({ description: 'could not upload files' })
  async getFile(@Query('file') file: string): Promise<any> {
    return 'http://192.168.18.56:3000/uploads/' + file;
  }
  @Delete('remove-file')
  async removeProfileImage(@Query('media') media, @Res() res): Promise<any> {
    if (media) {
      const filePath = path.join(__dirname, '..', '..', 'uploads/' + media);
      try {
        fs.unlink(filePath, (err) => {
          if (err)
            res.status(500).send({
              message: 'Could not delete the file. ' + err,
            });
          res.status(200).send({
            message: 'File is deleted.',
          });
        });
      } catch (e) {
        res.status(500).send({
          message: 'Could not delete the file. ' + e,
        });
      }
    } else throw new HttpException('file not selected', HttpStatus.BAD_REQUEST);
  }
}
