import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  //create comment route

  @Post('create/:postId')
  async postComment(@Body() data, @Param('postId') postId) {
    return this.commentService.postComment(data, postId);
  }

  //update comment route

  @Patch('edit/:commentId')
  async editComment(@Param('commentId') commentId, @Body() data) {
    return this.commentService.editComment(commentId, data);
  }

  //remove comment route

  @Delete('remove/:commentId')
  async removeComment(@Param('commentId') commentId) {
    return this.commentService.deleteComment(commentId);
  }
}
