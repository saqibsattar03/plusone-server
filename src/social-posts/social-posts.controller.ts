/* eslint-disable prettier/prettier */
import { Controller, HttpStatus, NotFoundException } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { IPost } from './interface/post.interface';
import { IPostLiked } from './interface/postLiked.interface';
import { SocialPostsService } from './social-posts.service';

@Controller('post')
export class SocialPostsController {
  constructor(private readonly socialPostservice: SocialPostsService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('media'))
  createPost(@UploadedFiles() media ,@Body() data) {
  
    // data.media= media.map(item=>({
    //     fileName: item.filename,
    //     filePath: item.path
    // }))
    data.media = {
      fileName: "demo",
      filePath:'hello'
      //fileName: media.filename,
     // filePath: media.path,

    };
    return this.socialPostservice.createPost(data);
  }

  @Get('get/:postId')
  async getPost(@Param('postId') postId){
    return this.socialPostservice.getPost(postId);
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('media'))
  async updatePost(@UploadedFile() media,@Param('id') id, @Body() data:IPost, @Res() res)
  {
    // data.media = media.map(item=>({
    //     fileName : item.filename,
    //     filePath: item.path
    // }))
    data.media ={
        fileName: media.filename,
        filePath: media.path
    }
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
