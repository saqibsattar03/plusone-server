import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../../../data/schemas/Profile.schema';
import { FollowerModule } from '../follower/follower.module';
import { FollowingModule } from '../following/following.module';
import { SocialPostsModule } from '../social-posts/social-posts.module';
import { RestaurantReviewModule } from '../restaurant-review/restaurant-review.module';
import { RestaurantModule } from '../../Admin/restaurant/restaurant/restaurant.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
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
