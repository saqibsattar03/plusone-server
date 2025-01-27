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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiQuery,
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
  @UseInterceptors(FileInterceptor('media'))
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
  @UseInterceptors(FilesInterceptor('media', 6))
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
  @ApiQuery({ name: 'media', type: String })
  @Delete('remove-file')
  async removeProfileImage(@Query('media') media, @Res() res): Promise<any> {
    if (media) {
      const filePath = path.join(__dirname, '..', '..', '/uploads/' + media);
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

  // @Post('csv')
  // @UseInterceptors(FileInterceptor('media', imageValidation))
  // async uploadCSVFile(@UploadedFile() media: Express.Multer.File) {
  //   try {
  //     const stream = createReadStream(media.path);
  //     const menu = [];
  //     stream
  //       .pipe(parse({ columns: true }))
  //       .on('error', (error) => {
  //         return error;
  //       })
  //       .on('data', (data) => {
  //         menu.push(data);
  //       })
  //       .on('end', async () => {
  //         // insert data into data collection here in end method
  //
  //       });
  //
  //     return media.filename;
  //   } catch (e) {
  //     throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Get('/number')
  number(@Query('pair') pair, @Query('number') number) {
    const k = pair; // Number of pairs
    const n = number; // Desired sum
    this.splitNumberIntoPairs(n, k);
  }
  splitNumberIntoPairs(number, k) {
    const digits = Array.from(String(number), Number);
    const pairs = [];

    if (digits.length < k) {
      console.log('Cannot split the number into the given number of pairs.');
      return;
    }

    const remainingDigits = digits;

    for (let i = 1; i < k; i++) {
      const pairLength = Math.floor(
        Math.random() * (remainingDigits.length - (k - i)) + 1,
      );
      const pair = remainingDigits.splice(0, pairLength);
      pairs.push(pair.join(''));
    }

    pairs.push(remainingDigits.join(''));

    for (const pair of pairs) {
      if (pair.length > 1 && pair.startsWith('0')) {
        console.log('Invalid pair:', pair);
        return;
      }
    }

    let sum = 0;
    for (const pair of pairs) {
      sum += parseInt(pair);
    }

    console.log('Pairs:', pairs);
    console.log('Sum:', sum);
  }
}
