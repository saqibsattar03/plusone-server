import {
  Controller,
  HttpException,
  HttpStatus,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  SocialPostDto,
  UpdateSocialPost,
} from '../../data/dtos/socialPost.dto';
import { SocialPostsService } from './social-posts.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';

@ApiTags('Social Post')
@Controller('post')
export class SocialPostsController {
  constructor(private readonly socialPostService: SocialPostsService) {}

  //Create Post Route

  @Post('')
  @ApiBearerAuth('access_token')
  @ApiBody({
    type: SocialPostDto,
    description: 'Request body to create a post',
  })
  @ApiCreatedResponse({
    type: SocialPostDto,
    description: 'Created post object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create post' })
  @UseGuards(JwtAuthGuard)
  createPost(@Request() request, @Body() data) {
    data.userId = request.user.userId;
    return this.socialPostService.createPost(data);
  }

  @Get('all')
  getAllPost(@Query() paginationDto: PaginationDto) {
    return this.socialPostService.getAllPost(paginationDto);
  }

  //Retrieve Single Post Route

  @Get(':postId')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({
    type: SocialPostDto,
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
  @ApiBearerAuth('access_token')
  @ApiQuery({ name: 'postId', type: String })
  @ApiBody({
    type: UpdateSocialPost,
    description: 'Request body to update post',
  })
  @ApiCreatedResponse({
    type: UpdateSocialPost,
    description: 'post updated successfully',
  })
  @ApiBadRequestResponse({ description: 'could not update post' })
  @UseGuards(JwtAuthGuard)
  async updatePost(@Request() request, @Body() data) {
    const post = await this.socialPostService.updatePost(
      request.user.userId,
      data,
    );
    if (!post) throw new NotFoundException(' Post does not exist');
    return post;
  }
  //Delete Post Route

  @Delete(':postId')
  @ApiBearerAuth('access_token')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({ description: 'post deleted successfully' })
  @ApiBadRequestResponse({ description: 'could not delete post' })
  @UseGuards(JwtAuthGuard)
  removePost(@Request() request, @Param('postId') postId) {
    return this.socialPostService.removePost(request.user.userId, postId);
  }

  //Like Post  Route

  @Post('like')
  @ApiBearerAuth('access_token')
  @ApiCreatedResponse({ description: 'post liked successfully' })
  @ApiQuery({
    name: 'postId',
    description: 'post id is required in Query parameter',
  })
  @ApiBadRequestResponse({ description: 'could not like post' })
  @UseGuards(JwtAuthGuard)
  postLiked(@Request() request, @Query('postId') postId) {
    if (postId) {
      return this.socialPostService.likePost(request.user.userId, postId);
    } else {
      throw new HttpException(
        'No Post Id was Provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Remove Like Route

  @Patch('remove-like')
  @ApiBearerAuth('access_token')
  @ApiCreatedResponse({ description: 'post unliked successfully' })
  @ApiBadRequestResponse({ description: 'could not unlike post' })
  @UseGuards(JwtAuthGuard)
  removeLike(@Request() request, @Query('postId') postId) {
    if (postId) {
      return this.socialPostService.removeLike(request.user.userId, postId);
    } else {
      throw new HttpException(
        'No Post Id was Provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('caption')
  filterRestaurantBasedOnCaption(@Query('keyword') keyword) {
    return this.socialPostService.filterPostBasedOnCaption(keyword);
  }
}
