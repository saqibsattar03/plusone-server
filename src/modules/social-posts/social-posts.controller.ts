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
  GetSocialPostDto,
  SocialPostDto,
  SocialPostResponseDto,
  UpdateSocialPost,
} from '../../data/dtos/socialPost.dto';
import { SocialPostsService } from './social-posts.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';

@ApiTags('Social Post')
@Controller('post')
export class SocialPostsController {
  constructor(private readonly socialPostService: SocialPostsService) {}

  /*** Create Post Route ***/

  @Post()
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

  /*** get all public posts or following posts ***/
  @ApiBody({ type: GetSocialPostDto })
  @ApiCreatedResponse({ type: SocialPostResponseDto })
  @ApiBadRequestResponse({ description: 'can not fetch posts' })
  @Post('all')
  @UseGuards(JwtAuthGuard)
  getAllPost(
    @Query() paginationDto: PaginationDto,
    @Body() data,
    @Request() request,
  ) {
    data.loggedInUser = request.user.userId;
    return this.socialPostService.getAllPost(paginationDto, data);
  }

  // @ApiParam({ type: String, name: 'userId' })
  // @ApiCreatedResponse({ type: SocialPostDto })
  // @ApiBadRequestResponse({ description: 'can not fetch posts' })
  // @Get('all/:userId')
  // getAllPostsOfSingleUser(
  //   @Query() paginationDto: PaginationDto,
  //   @Param('userId') userId,
  // ) {
  //   return this.socialPostService.getAllPostsOfSingleUser(
  //     paginationDto,
  //     userId,
  //   );
  // }

  /***Retrieve Single Post Route***/

  @Get(':postId')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({
    type: SocialPostDto,
    description: 'post fetched successfully',
  })
  @ApiBadRequestResponse({ description: 'could not fetch the post object' })
  async getSinglePost(@Param('postId') postId) {
    if (postId) {
      return this.socialPostService.getSinglePost(postId);
    } else {
      throw new HttpException(
        'No Post Id was Provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /***Post Update Route ***/

  @Patch('')
  @ApiBearerAuth('access-token')
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
  /***Delete Post Route ***/

  @Delete(':postId')
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({ description: 'post deleted successfully' })
  @ApiBadRequestResponse({ description: 'could not delete post' })
  @UseGuards(JwtAuthGuard)
  deleteSinglePost(@Request() request, @Param('postId') postId) {
    return this.socialPostService.deleteSinglePost(request.user.userId, postId);
  }

  /***Like Post  Route ***/

  @Post('like')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ description: 'post liked successfully' })
  @ApiQuery({
    name: 'postId',
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

  /***Remove Like Route ***/

  @Patch('remove-like')
  @ApiBearerAuth('access-token')
  @ApiQuery({
    name: 'postId',
  })
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

  /*** search post by caption ***/
  @ApiQuery({ type: String, name: 'keyword' })
  @Post('search-by-caption')
  filterRestaurantBasedOnCaption(@Body() data) {
    return this.socialPostService.filterPostBasedOnCaption(data.keyword);
  }

  @Post('search-by-location')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        longitude: { type: 'number' },
        latitude: { type: 'number' },
      },
    },
  })
  @ApiCreatedResponse({ type: SocialPostDto })
  @ApiBadRequestResponse({ description: 'can not fetch posts' })
  searchPostByLocation(@Body() data) {
    return this.socialPostService.searchPostByLocation(data);
  }
}
