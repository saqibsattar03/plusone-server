import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
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
    description: 'Comment created succeessfully',
  })
  @ApiBadRequestResponse({ description: 'comment could not created' })
  async postComment(@Body() data, @Param('postId') postId) {
    return this.commentService.postComment(data, postId);
  }

  //update comment route
  @Patch('edit/:commentId')
  @ApiParam({ name: 'commentId', type: 'string' })
  @ApiBody({ type: CreateCommentDTO, description: 'update comment' })
  @ApiCreatedResponse({
    type: CreateCommentDTO,
    description: 'Comment updated succeessfully',
  })
  @ApiBadRequestResponse({ description: 'comment could not updated' })
  async editComment(@Param('commentId') commentId, @Body() data) {
    return this.commentService.editComment(commentId, data);
  }

  //remove comment route
  @Delete('remove/:commentId')
  @ApiParam({ name: 'commentId', type: 'string' })
  @ApiCreatedResponse({
    description: 'Comment removed succeessfully',
  })
  @ApiBadRequestResponse({ description: 'comment could not removed' })
  async removeComment(@Param('commentId') commentId) {
    return this.commentService.deleteComment(commentId);
  }
}
