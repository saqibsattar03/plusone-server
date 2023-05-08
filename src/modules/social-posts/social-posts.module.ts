import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/data/schemas/post.schema';
import { LikedPost, LikedPostSchema } from 'src/data/schemas/postLiked.schema';
import { SocialPostsController } from './social-posts.controller';
import { SocialPostsService } from './social-posts.service';
import { FollowingModule } from '../following/following.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: LikedPost.name, schema: LikedPostSchema },
    ]),
    forwardRef(() => FollowingModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [SocialPostsController],
  providers: [SocialPostsService],
  exports: [SocialPostsService],
})
export class SocialPostsModule {}
