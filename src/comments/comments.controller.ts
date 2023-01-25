import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { get } from 'http';
import { CommentsService } from './comments.service';
import { IComment } from './interface/comment.interface';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post('create/:postId')
  async postComment(@Body() data: IComment, @Param('postId') postId) {
    return this.commentService.postComment(data, postId);
  }

  @Patch('edit/:commentId')
  async editComment(@Param('commentId') commentId, @Body() data: IComment) {
    return this.commentService.editComment(commentId, data);
  }

  @Delete('remove/:commentId')
  async removeComment(@Param('commentId') commentId): Promise<IComment> {
    return this.commentService.deleteComment(commentId);
  }
}
