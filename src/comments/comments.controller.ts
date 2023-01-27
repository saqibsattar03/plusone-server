import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from './dto/comment.dto';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  //create comment route
  @ApiBody({ type: CreateCommentDTO, description: 'create comment' })
  @Post('create/:postId')
  async postComment(@Body() data, @Param('postId') postId) {
    return this.commentService.postComment(data, postId);
  }

  //update comment route
  @ApiBody({ type: CreateCommentDTO, description: 'edit comment' })
  @Patch('edit/:commentId')
  async editComment(@Param('commentId') commentId, @Body() data) {
    return this.commentService.editComment(commentId, data);
  }

  //remove comment route
  @ApiBody({ type: CreateCommentDTO, description: 'delete comment' })
  @Delete('remove/:commentId')
  async removeComment(@Param('commentId') commentId) {
    return this.commentService.deleteComment(commentId);
  }
}
