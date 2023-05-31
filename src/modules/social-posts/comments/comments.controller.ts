import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { Get } from '@nestjs/common/decorators';
import { CommentDto } from '../../../data/dtos/socialPost.dto';
import { JwtAuthGuard } from '../../../common/auth/guards/jwt-auth.guard';
import { ViewAuthFilter } from '../../../common/configs/redirect-route.config';

@ApiTags('Comments')
@Controller('comment')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  //create comment route

  @Post()
  @ApiBearerAuth('access-token')
  @ApiBody({
    schema: {
      properties: {
        postId: { type: 'string' },
        commentObject: {
          type: 'object',
          properties: {
            commentText: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: CommentDto,
    description: 'Comment created successfully',
  })
  @ApiBadRequestResponse({ description: 'comment could not be created' })
  @UseGuards(JwtAuthGuard)
  async postComment(@Request() request, @Body() data) {
    data.commentObject.userId = request.user.userId;
    return this.commentService.postComment(data);
  }

  @Get('all')
  @ApiQuery({ type: String, name: 'postId' })
  @ApiCreatedResponse({
    schema: {
      properties: {
        postId: { type: 'string' },
        commentObject: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            commentText: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              firstname: { type: 'string' },
              surname: { type: 'string' },
              profileImage: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'comment could not be created' })
  getPostComment(@Query('postId') postId) {
    return this.commentService.getPostComment(postId);
  }

  //update comment route
  @Patch(':postId')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiBadRequestResponse({ description: 'comment could not update' })
  async editComment(@Param('postId') postId, @Body() data) {
    return this.commentService.editComment(postId, data);
  }

  //remove comment route
  @Delete('remove-single')
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'commentId', type: 'string' })
  @ApiQuery({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({
    description: 'Comment removed successfully',
  })
  @ApiBadRequestResponse({ description: 'comment could not removed' })
  @UseGuards(JwtAuthGuard)
  async deleteSingleComment(@Request() request, @Body() data) {
    data.userId = request.user.userId;
    return this.commentService.deleteSingleComment(data);
  }

  @Delete('remove-all')
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({
    description: 'Comment removed successfully',
  })
  @ApiBadRequestResponse({ description: 'comment could not remove' })
  @UseGuards(JwtAuthGuard)
  async deleteAllComment(@Request() request, @Query('postId') postId) {
    if (!request.user.userId) {
      throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.commentService.deleteAllComment(postId);
  }
}
