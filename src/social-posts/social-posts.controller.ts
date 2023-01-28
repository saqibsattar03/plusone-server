/* eslint-disable prettier/prettier */
import {  Controller,  HttpException, HttpStatus, NotFoundException} from '@nestjs/common';
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
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiParam} from '@nestjs/swagger';
import { imageValidation } from './common/image.config';
import { CreatePostDTO } from './dto/create-post.dto';
import { SocialPostsService } from './social-posts.service';


@Controller('post')
export class SocialPostsController {
  constructor(private readonly socialPostservice: SocialPostsService) {}

  //Create Post Route

  @Post('create')
  @ApiBody({type: CreatePostDTO, description:"Request body to create a post"})
  @ApiCreatedResponse({type:CreatePostDTO, description:'Created post object as response' })
  @ApiBadRequestResponse({description:'can not create post'})
  @ApiConsumes('multipart/form-data')

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username:{type: 'string'},
        location:{type: 'string'},
        caption:{type: 'string'},
        media: { 
          type: 'string',
          format: 'binary',
        },
      },
    },
  })

  @UseInterceptors(FilesInterceptor('media',5,imageValidation))
  createPost(@UploadedFiles() media: Array<Express.Multer.File> ,@Body() data, @Res() res) {
    
    if(media.length){
     
     
      data.media= media.map(item=>({
        fileName: item.filename,
        filePath: item.path,
    }))
    res.send("images formatted properly")
    return this.socialPostservice.createPost(data);
     
    }
    else
    {
      return res.send("Photos/video must be provided to create a post")
    }

  }

  //Retreive Single Post Route


  @Get('get/:postId')
  @ApiParam({name:'postId', type:'string'})
  @ApiCreatedResponse({type: CreatePostDTO,description:"post fetched succeessfully"})
  @ApiBadRequestResponse({description:'could not fetch the post object'})
  
  
  async getPost(@Param('postId') postId){
    if(postId)
    {
      return this.socialPostservice.getPost(postId);
    }
    else
    {
      throw new HttpException("No Post Id was Provided", HttpStatus.BAD_REQUEST)
    }
  }

  //Post Update Route

  @Patch('update/:postId')
  @ApiParam({name:'postId',type:'string'})
  @ApiCreatedResponse({type: CreatePostDTO,description:"post updated succeessfully"})
  @ApiBadRequestResponse({description:'could not update post'})
  
  @ApiConsumes('multipart/form-data')

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username:{type: 'string'},
        location:{type: 'string'},
        caption:{type: 'string'},
        media: { 
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  
  @UseInterceptors(FilesInterceptor('media',5, imageValidation))
  async updatePost(@UploadedFiles() media: Array<Express.Multer.File>,@Param('postId') postId, @Body() data, @Res() res)
  {
    data.media = media.map(item=>({
        fileName : item.filename,
        filePath: item.path
    }))
   const post = await  this.socialPostservice.updatePost(postId, data)
   if(!post) throw new NotFoundException(' Post does not exist');
        return res.status(HttpStatus.OK).json({
            messsage: 'customer updated successfully',
            post
        });
  }

  //Delete Post Route

  @Delete('remove/:postId')
  @ApiParam({name:"postId", type:"string"})
  @ApiCreatedResponse({description:"post deleted succeessfully"})
  @ApiBadRequestResponse({description:'could not delete post'})

  async removePost(@Param('postId') postId, @Res() res){
    const post = await this.socialPostservice.removePost(postId)
        return res.status(HttpStatus.OK).json({
            messsage: 'post deleted successfully',
            post
        });

  }

  //Like Post  Route

  @Post('like/:userId')
  @ApiParam({name:"userId", type:"string"})
  @ApiCreatedResponse({description:"post liked succeessfully"})
  @ApiBody({description:'post id is required in body'})
  @ApiBadRequestResponse({description:'could not like post'})
  postLiked(@Body() data,@Param('userId') userId)
  {
    if(data.postId){
    return this.socialPostservice.likePost(userId,data)
    }
    else
    {
      throw new HttpException("No Post Id was Provided", HttpStatus.BAD_REQUEST)
    }
  }

  //Remove Like Route

  @Patch('remove-like/:userId')
  @ApiParam({name:"userId", type:"string"})
  @ApiCreatedResponse({description:"post unliked succeessfully"})
  @ApiBody({description:'post id is required in body'})
  @ApiBadRequestResponse({description:'could not unlike post'})
  removeLike(@Param('userId') userId, @Body() data){
    if(data.postId)
    {
    this.socialPostservice.removeLike(userId, data)
    }
    else
    {
      throw new HttpException("No Post Id was Provided", HttpStatus.BAD_REQUEST)
    }

  }
}
