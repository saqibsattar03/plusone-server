import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { CommentSchema } from 'src/Schemas/comment.schema';
import { PostSchema } from 'src/Schemas/post.schema';
import { PostLikedSchema } from 'src/Schemas/postLiked.schema';
import { SocialPostsController } from './social-posts.controller';
import { SocialPostsService } from './social-posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
      { name: 'PostLiked', schema: PostLikedSchema },
      { name: 'Comment', schema: CommentSchema },
    ]),
    MulterModule.register({
      dest: '../uploads',
    }),
  ],
  controllers: [SocialPostsController],
  providers: [SocialPostsService],
})
export class SocialPostsModule {}
