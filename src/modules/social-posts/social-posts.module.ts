import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/data/schemas/comment.schema';
import { Post, PostSchema } from 'src/data/schemas/post.schema';
import { LikedPost, LikedPostSchema } from 'src/data/schemas/postLiked.schema';
import { SocialPostsController } from './social-posts.controller';
import { SocialPostsService } from './social-posts.service';
import { FollowerService } from '../follower/follower.service';
import { FollowerModule } from '../follower/follower.module';
import { FollowingModule } from '../following/following.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: LikedPost.name, schema: LikedPostSchema },
    ]),
    FollowingModule,
  ],
  controllers: [SocialPostsController],
  providers: [SocialPostsService],
  exports: [SocialPostsService],
})
export class SocialPostsModule {}
