import {
  Controller,
  HttpException,
  HttpStatus,
  NotFoundException,
  Query,
} from '@nestjs/common';
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
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { imageValidation } from '../common/image.config';
import { CreatePostDTO } from './dto/create-post.dto';
import { SocialPostsService } from './social-posts.service';

@Controller('post')
export class SocialPostsController {
  constructor(private readonly socialPostservice: SocialPostsService) {}

  //Create Post Route

  @Post('create')
  @ApiBody({
    type: CreatePostDTO,
    description: 'Request body to create a post',
  })
  @ApiCreatedResponse({
    type: CreatePostDTO,
    description: 'Created post object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        location: { type: 'string' },
        caption: { type: 'string' },
        media: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('media', 5, imageValidation))
  createPost(
    @UploadedFiles() media: Array<Express.Multer.File>,
    @Body() data,
    @Res() res,
  ) {
    if (media.length) {
      data.media = media.map((item) => ({
        fileName: item.filename,
        filePath: item.path,
      }));
      res.send('images formatted properly');
      return this.socialPostservice.createPost(data);
    } else {
      return res.send('Photos/video must be provided to create a post');
    }
  }

  //Retreive Single Post Route

  @Get('get/:postId')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({
    type: CreatePostDTO,
    description: 'post fetched succeessfully',
  })
  @ApiBadRequestResponse({ description: 'could not fetch the post object' })
  async getPost(@Param('postId') postId) {
    if (postId) {
      return this.socialPostservice.getPost(postId);
    } else {
      throw new HttpException(
        'No Post Id was Provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Post Update Route

  @Patch('update/:postId')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({
    type: CreatePostDTO,
    description: 'post updated succeessfully',
  })
  @ApiBadRequestResponse({ description: 'could not update post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        location: { type: 'string' },
        caption: { type: 'string' },
        media: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('media', 5, imageValidation))
  async updatePost(
    @UploadedFiles() media: Array<Express.Multer.File>,
    @Param('postId') postId,
    @Body() data,
    @Res() res,
  ) {
    data.media = media.map((item) => ({
      fileName: item.filename,
      filePath: item.path,
    }));
    const post = await this.socialPostservice.updatePost(postId, data);
    if (!post) throw new NotFoundException(' Post does not exist');
    return res.status(HttpStatus.OK).json({
      messsage: 'customer updated successfully',
      post,
    });
  }

  //Delete Post Route

  @Delete('remove/:postId')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({ description: 'post deleted successfully' })
  @ApiBadRequestResponse({ description: 'could not delete post' })
  async removePost(@Param('postId') postId, @Res() res) {
    const post = await this.socialPostservice.removePost(postId);
    return res.status(HttpStatus.OK).json({
      message: 'post deleted successfully',
      post,
    });
  }

  //Like Post  Route

  @Post('like')
  @ApiQuery({
    name: 'userId',
    description: 'user id is required in Query parameter',
  })
  @ApiCreatedResponse({ description: 'post liked successfully' })
  @ApiQuery({
    name: 'postId',
    description: 'post id is required in Query parameter',
  })
  @ApiBadRequestResponse({ description: 'could not like post' })
  postLiked(@Query('userId') userId, @Query('postId') postId) {
    if (postId) {
      return this.socialPostservice.likePost(userId, postId);
    } else {
      throw new HttpException(
        'No Post Id was Provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Remove Like Route

  @Patch('remove-like')
  @ApiQuery({
    name: 'userId',
    description: 'User id is required in Query Parameter to remove like ',
  })
  @ApiCreatedResponse({ description: 'post unliked successfully' })
  @ApiQuery({ description: 'post id is required in Query Parameter' })
  @ApiBadRequestResponse({ description: 'could not unlike post' })
  removeLike(@Query('userId') userId, @Query('postId') postId) {
    if (postId) {
      return this.socialPostservice.removeLike(userId, postId);
    } else {
      throw new HttpException(
        'No Post Id was Provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
