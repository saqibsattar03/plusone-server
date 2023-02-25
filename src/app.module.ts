import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocialPostsModule } from './social-posts/social-posts.module';
import { CommentsModule } from './social-posts/comments/comments.module';
import { ProfilesModule } from './User/profiles/profiles.module';
import { FollowerModule } from './User/follower/follower.module';
import { FollowingModule } from './user/following/following.module';
import { RestaurantReviewModule } from './restaurant/restaurant-review/restaurant-review.module';
import { ChatModule } from './chat/chat.module';
import { RestaurantModule } from './restaurant/restaurant/restaurant.module';
import { VoucherModule } from './restaurant/voucher/voucher.module';

@Module({
  imports: [
    SocialPostsModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/plus-one', {
      useNewUrlParser: true,
    }),
    CommentsModule,
    ProfilesModule,
    FollowerModule,
    FollowingModule,
    RestaurantReviewModule,
    ChatModule,
    RestaurantModule,
    VoucherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
