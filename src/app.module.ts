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
import { QuoteModule } from './quote/quote.module';
import { CustomerServiceModule } from './customer-service/customer-service.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FilterModule } from './filter/filter.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    SocialPostsModule,
    MongooseModule.forRoot('mongodb://plusoneadmin:4vxm5SSBXm@172.17.02:27017/plusone--db?authSource=admin&retryWrites=true&w=majority', {
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
    QuoteModule,
    CustomerServiceModule,
    AuthModule,
    UserModule,
    FilterModule,
    MulterModule.register({
      dest: '../uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
