import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Comment, CommentSchema } from 'src/Schemas/comment.schema';
import { Post, PostSchema } from 'src/Schemas/post.schema';
import { LikedPost, LikedPostSchema } from 'src/Schemas/postLiked.schema';
import { User, UserSchema } from 'src/Schemas/user.schema';
import { SocialPostsController } from './social-posts.controller';
import { SocialPostsService } from './social-posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: LikedPost.name, schema: LikedPostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    MulterModule.register({
      dest: '../uploads',
    }),
  ],
  controllers: [SocialPostsController],
  providers: [SocialPostsService],
})
export class SocialPostsModule {}
