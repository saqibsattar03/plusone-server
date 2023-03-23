import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/Schemas/comment.schema';
import { Post, PostSchema } from 'src/Schemas/post.schema';
import { LikedPost, LikedPostSchema } from 'src/Schemas/postLiked.schema';
import { SocialPostsController } from './social-posts.controller';
import { SocialPostsService } from './social-posts.service';
import { Profile, ProfileSchema } from '../../Schemas/Profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: LikedPost.name, schema: LikedPostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [SocialPostsController],
  providers: [SocialPostsService],
})
export class SocialPostsModule {}
