import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// Define the absolute path to the uploads directory
const UPLOADS_DIR = path.join(process.cwd(), '..', 'uploads');

// Multer configuration
export const multerConfig: MulterOptions = {
  dest: UPLOADS_DIR,
  storage: diskStorage({
    // Destination storage path details
    destination: function (req: any, file: any, callback: any) {
      if (!existsSync(UPLOADS_DIR)) {
        mkdirSync(UPLOADS_DIR);
      }
      callback(null, UPLOADS_DIR);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: 10000000, // 5 Mb,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const fileSize = parseInt(req.headers['content-length']);
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      if (fileSize > 10000000) {
        cb(
          new HttpException(
            'Image size is too large',
            HttpStatus.NOT_ACCEPTABLE,
          ),
        );
      }
      // Allow storage of file
      cb(null, true);
    } else if (file.mimetype.match(/\/(mp4)$/)) {
      if (fileSize > 2000000) {
        cb(
          new HttpException(
            'video size is too large',
            HttpStatus.NOT_ACCEPTABLE,
          ),
        );
      }
      cb(null, true);
    } else if (file.mimetype.match(/\/(pdf)$/)) {
      if (fileSize > 2000000) {
        cb(
          new HttpException(
            'file size is too large',
            HttpStatus.NOT_ACCEPTABLE,
          ),
        );
      }
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};
