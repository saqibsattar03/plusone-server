/* eslint-disable prettier/prettier */
import { Controller, FileTypeValidator, HttpStatus, NotFoundException, ParseFilePipe,  } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common/decorators';
import {   FilesInterceptor } from '@nestjs/platform-express';
import { SocialPostsService } from './social-posts.service';

@Controller('post')
export class SocialPostsController {
  constructor(private readonly socialPostservice: SocialPostsService) {}

  //Create Post Route

  @Post('create')
  @UseInterceptors(FilesInterceptor('media',5))
  createPost(@UploadedFiles(
    new ParseFilePipe({
      validators:[
        new FileTypeValidator({fileType: (/\.(jpe?g|tiff?|png)$/i)})
      ]
    })) media: Array<Express.Multer.File> ,@Body() data) {
    data.media= media.map(item=>({
        fileName: item.filename,
        filePath: item.path
    }))
    return this.socialPostservice.createPost(data);
  }

  //Retrieve Single Post Route

  @Get('get/:postId')
  async getPost(@Param('postId') postId){
    return this.socialPostservice.getPost(postId);
  }

  //Post Update Route

  @Patch('update/:id')
  @UseInterceptors(FilesInterceptor('media',5))
  async updatePost(@UploadedFiles(
    // new ParseFilePipe({
    //   validators:[
    //     new FileTypeValidator({fileType: /\.(jpg|jpeg|png)$/})
    //   ]
    // })
    // new ParseFilePipeBuilder()
    // .addFileTypeValidator({
    //   fileType: 'jpeg | jpg',
    // })
    // // .addMaxSizeValidator({
    // //   maxSize
    // // })
    // .build({
    //   errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    // }),
  ) media: Array<Express.Multer.File>,@Param('id') id, @Body() data, @Res() res)
  {
    data.media = media.map(item=>({
        fileName : item.filename,
        filePath: item.path
    }))
   const post = await  this.socialPostservice.updatePost(id, data)
   if(!post) throw new NotFoundException(' Post does not exist');
        return res.status(HttpStatus.OK).json({
            messsage: 'customer updated successfully',
            post
        });
  }

  //Delete Post Route

  @Delete('remove/:id')
  async removePost(@Param('id') id, @Res() res){
    const post = await this.socialPostservice.removePost(id)
   if(!post) throw new NotFoundException(' Post does not exist');
        return res.status(HttpStatus.OK).json({
            messsage: 'customer updated successfully',
            post
        });
  }

  //Like Post  Route

  @Post('like/:userId')
  postLiked(@Body() data,@Param('userId') userId)
  {
    console.log("post liked", data)
    return this.socialPostservice.likePost(userId,data)
  }

  //Remove Like Route

  @Patch('remove-like/:userId')
  removeLike(@Param('userId') userId, @Body() postId){
    this.socialPostservice.removeLike(userId, postId)
  }
}
