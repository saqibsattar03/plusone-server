import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../../Schemas/Profile.schema';
import {
  RedeemVoucher,
  RedeemVoucherSchema,
} from '../../Schemas/redeemVoucher.schema';
import { Restaurant, RestaurantSchema } from '../../Schemas/restaurant.schema';
import { User, UserSchema } from '../../Schemas/user.schema';
import { Comment, CommentSchema } from '../../Schemas/comment.schema';
import { Post, PostSchema } from '../../Schemas/post.schema';
import {
  RestaurantReview,
  RestaurantReviewSchema,
} from '../../Schemas/restaurantReview.schema';
import { Follower, FollowerSchema } from '../../Schemas/follower.schema';
import { Following, FollowingSchema } from '../../Schemas/following.schema';
import { LikedPost, LikedPostSchema } from '../../Schemas/postLiked.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
      {
        name: Restaurant.name,
        schema: RestaurantSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: RestaurantReview.name,
        schema: RestaurantReviewSchema,
      },
      {
        name: Follower.name,
        schema: FollowerSchema,
      },
      {
        name: Following.name,
        schema: FollowingSchema,
      },
      {
        name: RedeemVoucher.name,
        schema: RedeemVoucherSchema,
      },
      {
        name: LikedPost.name,
        schema: LikedPostSchema,
      },
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
