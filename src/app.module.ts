import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocialPostsModule } from './modules/social-posts/social-posts.module';
import { CommentsModule } from './modules/social-posts/comments/comments.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { FollowerModule } from './modules/follower/follower.module';
import { FollowingModule } from './modules/following/following.module';
import { RestaurantReviewModule } from './modules/restaurant-review/restaurant-review.module';
import { ChatModule } from './modules/chat/chat.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { VoucherModule } from './modules/voucher/voucher.module';
import { QuoteModule } from './modules/quote/quote.module';
import { CustomerServiceModule } from './modules/customer-service/customer-service.module';
import { AuthModule } from './common/auth/auth.module';
import { FilterModule } from './filter/filter.module';
import { MulterModule } from '@nestjs/platform-express';
import { DepositMoneyModule } from './modules/deposit-money/deposit-money.module';
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