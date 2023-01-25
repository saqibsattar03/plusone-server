/* eslint-disable prettier/prettier */
export class CreatePostDTO{
    username: string;
    location: string;
    caption: string;
    comments: {object};
    media:{
        fileName: string,
        filePath: string
      }
    
}