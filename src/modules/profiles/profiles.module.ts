import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../../data/schemas/profile.schema';
import { FollowerModule } from '../follower/follower.module';
import { FollowingModule } from '../following/following.module';
import { SocialPostsModule } from '../social-posts/social-posts.module';
import { RestaurantReviewModule } from '../restaurant-review/restaurant-review.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import {
  ForgotPassword,
  ForgotPasswordSchema,
} from '../../data/schemas/forgotPassword.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
      {
        name: ForgotPassword.name,
        schema: ForgotPasswordSchema,
      },
    ]),
    FollowerModule,
    FollowingModule,
    SocialPostsModule,
    RestaurantReviewModule,
    RestaurantModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
