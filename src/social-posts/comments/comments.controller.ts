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
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from './dto/comment.dto';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  //create comment route

  @Post('create/:postId')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiBody({ type: CreateCommentDTO, description: 'create comment' })
  @ApiCreatedResponse({
    type: CreateCommentDTO,
    description: 'Comment created successfully',
  })
  @ApiBadRequestResponse({ description: 'comment could not be created' })
  async postComment(@Body() data, @Param('postId') postId) {
    return this.commentService.postComment(data, postId);
  }

  //update comment route
  @Patch('edit/:postId')
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
