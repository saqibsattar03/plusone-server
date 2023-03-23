import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { Get } from '@nestjs/common/decorators';
import { CommentDto } from '../../../../data/dtos/socialPost.dto';

@ApiTags('Comments')
@Controller('comment')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  //create comment route

  @Post(':postId')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiBody({ type: CommentDto, description: 'create comment' })
  @ApiCreatedResponse({
    type: CommentDto,
    description: 'Comment created successfully',
  })
  @ApiBadRequestResponse({ description: 'comment could not be created' })
  async postComment(@Body() data, @Param('postId') postId) {
    return this.commentService.postComment(data, postId);
  }

  @Get()
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
  @Delete('remove')
  @ApiQuery({ name: 'commentId', type: 'string' })
  @ApiQuery({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({
    description: 'Comment removed successfully',
  })
  @ApiBadRequestResponse({ description: 'comment could not removed' })
  async removeComment(@Query('commentId') commentId, @Query('postId') postId) {
    return this.commentService.deleteComment(commentId, postId);
  }
}
