/* eslint-disable prettier/prettier */
import { v4 as uuidv4 } from 'uuid';

// import fs from 'fs';
// import fileType from 'file-type';

// import path = require('path')

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const valiFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = [
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const imageValidation = {
    fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    console.log("files = ",file)
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null,false);
  },
};
