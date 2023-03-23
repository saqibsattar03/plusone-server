import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocialPostsModule } from './modules/user/social-posts/social-posts.module';
import { CommentsModule } from './modules/user/social-posts/comments/comments.module';
import { ProfilesModule } from './modules/user/profiles/profiles.module';
import { FollowerModule } from './modules/user/follower/follower.module';
import { FollowingModule } from './modules/user/following/following.module';
import { RestaurantReviewModule } from './modules/user/restaurant-review/restaurant-review.module';
import { ChatModule } from './modules/user/chat/chat.module';
import { RestaurantModule } from './modules/Admin/restaurant/restaurant/restaurant.module';
import { VoucherModule } from './modules/Admin/restaurant/voucher/voucher.module';
import { QuoteModule } from './modules/Admin/quote/quote.module';
import { CustomerServiceModule } from './modules/user/customer-service/customer-service.module';
import { AuthModule } from './common/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FilterModule } from './filter/filter.module';
import { MulterModule } from '@nestjs/platform-express';
import { DepositMoneyModule } from './modules/Admin/restaurant/deposit-money/deposit-money.module';
import { DbModule } from './common/db/db.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    //To use .env variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.' + process.env.NODE_ENVIRONMENT,
    }),
    SocialPostsModule,
    DbModule,
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
    DepositMoneyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
