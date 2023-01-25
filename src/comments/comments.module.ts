import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from 'src/Schemas/comment.schema';
import { PostSchema } from 'src/Schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Comment',
        schema: CommentSchema,
      },
      {
        name: 'Post',
        schema: PostSchema,
      },
    ]),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
