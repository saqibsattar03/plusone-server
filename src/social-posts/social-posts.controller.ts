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
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDTO } from './dto/create-post.dto';
import { SocialPostsService } from './social-posts.service';
import { UpdatePostDTO } from './dto/update-post.dto';

@ApiTags('Social Post')
@Controller('post')
export class SocialPostsController {
  constructor(private readonly socialPostService: SocialPostsService) {}

  //Create Post Route

  @Post('')
  @ApiBody({
    type: CreatePostDTO,
    description: 'Request body to create a post',
  })
  @ApiCreatedResponse({
    type: CreatePostDTO,
    description: 'Created post object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create post' })
  createPost(@Body() data) {
    if (data.media.length > 0) return this.socialPostService.createPost(data);
    else
      throw new HttpException(
        'Photos/video must be provided to create a post',
        HttpStatus.BAD_REQUEST,
      );
  }

  //Retrieve Single Post Route

  @Get(':postId')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({
    type: CreatePostDTO,
    description: 'post fetched successfully',
  })
  @ApiBadRequestResponse({ description: 'could not fetch the post object' })
  async getPost(@Param('postId') postId) {
    if (postId) {
      return this.socialPostService.getPost(postId);
    } else {
      throw new HttpException(
        'No Post Id was Provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Post Update Route

  @Patch('')
  @ApiQuery({ name: 'postId', type: String })
  @ApiQuery({ name: 'userId', type: String })
  @ApiBody({
    type: UpdatePostDTO,
    description: 'Request body to update post',
  })
  @ApiCreatedResponse({
    type: UpdatePostDTO,
    description: 'post updated successfully',
  })
  @ApiBadRequestResponse({ description: 'could not update post' })
  async updatePost(
    @Query('postId') postId,
    @Query('userId') userId,
    @Body() data,
  ) {
    const post = await this.socialPostService.updatePost(postId, userId, data);
    if (!post) throw new NotFoundException(' Post does not exist');
    return post;
  }

  @Patch('update-post-audience-preference')
  updatePostPreference(
    @Query('userId') userId,
    @Query('postId') postId,
    @Query('preference') preference,
  ) {
    return this.socialPostService.updatePostPreference(
      userId,
      postId,
      preference,
    );
  }
  //Delete Post Route

  @Delete(':postId')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({ description: 'post deleted successfully' })
  @ApiBadRequestResponse({ description: 'could not delete post' })
  removePost(@Param('postId') postId) {
    return this.socialPostService.removePost(postId);
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
      return this.socialPostService.likePost(userId, postId);
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
      return this.socialPostService.removeLike(userId, postId);
    } else {
      throw new HttpException(
        'No Post Id was Provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
