import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const multerConfig = {
  // dest: process.env.UPLOAD_LOCATION,
  dest: function (req, file, callback) {
    callback('/uploads/');
  },
};

// Multer upload options

export const imageValidation = {
  // Enable file size limits
  limits: {
    // fileSize: +process.env.MAX_FILE_SIZE,
    fileSize: 10000000, // 5 Mb,
  },
  // Check the mimetypes to allow for upload
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
    } else if (file.mimetype.match(/\/(csv)$/)) {
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
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: function (req: any, file: any, callback: any) {
      // const uploadPath = multerConfig.dest;
      if (!existsSync('/uploads/')) {
        mkdirSync('/uploads/');
      }
      callback(null, '/uploads/');
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};
