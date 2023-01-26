/* eslint-disable prettier/prettier */
import { Controller, FileTypeValidator, HttpStatus, NotFoundException, ParseFilePipe, ParseFilePipeBuilder } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common/decorators';
import {  FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { IPostLiked } from './interface/postLiked.interface';
import { SocialPostsService } from './social-posts.service';

@Controller('post')
export class SocialPostsController {
  constructor(private readonly socialPostservice: SocialPostsService) {}

  
  @Post('create')
  @UseInterceptors(FilesInterceptor('media',5))
  createPost(@UploadedFiles(
    // new ParseFilePipe({
    //   validators:[
    //     new FileTypeValidator({fileType: (/\.(jpe?g|tiff?|png)$/i)})
    //   ]
    // })
    
  ) media: Array<Express.Multer.File> ,@Body() data) {
    data.media= media.map(item=>({
        fileName: item.filename,
        filePath: item.path
    }))
    return this.socialPostservice.createPost(data);
  }

  @Get('get/:postId')
  async getPost(@Param('postId') postId){
    return this.socialPostservice.getPost(postId);
  }
  // FilesInterceptor('media')
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

  @Delete('remove/:id')
  async removePost(@Param('id') id, @Res() res){
    const post = await this.socialPostservice.removePost(id)
   if(!post) throw new NotFoundException(' Post does not exist');
        return res.status(HttpStatus.OK).json({
            messsage: 'customer updated successfully',
            post
        });
  }
  @Post('like')
  postLiked(@Body() data: IPostLiked)
  {
    console.log("post liked", data)
    return this.socialPostservice.likePost(data)
  }
  @Post('unlike/:userid')
  postUnliked(@Param('userid') userId, @Query('postid') postid){
    this.socialPostservice.unlikePost(userId, postid)
  }
}
