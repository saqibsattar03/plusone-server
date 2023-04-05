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

@ApiTags('Comments')
@Controller('comment')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  //create comment route

  @Post('')
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'postId', type: 'string' })
  @ApiBody({ type: CommentDto, description: 'create comment' })
  @ApiCreatedResponse({
    type: CommentDto,
    description: 'Comment created successfully',
  })
  @ApiBadRequestResponse({ description: 'comment could not be created' })
  @UseGuards(JwtAuthGuard)
  async postComment(@Request() request, @Body() data) {
    console.log('request.userId = ', request.user.usrId);
    data.commentObject.userId = request.user.userId;
    console.log('data.userId = ', data.commentObject.userId);
    return this.commentService.postComment(data);
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
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'commentId', type: 'string' })
  @ApiQuery({ name: 'postId', type: 'string' })
  @ApiCreatedResponse({
    description: 'Comment removed successfully',
  })
  @ApiBadRequestResponse({ description: 'comment could not removed' })
  @UseGuards(JwtAuthGuard)
  async removeComment(@Request() request, @Body() data) {
    data.userId = request.use.userId;
    return this.commentService.deleteComment(data);
  }
}
