import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocialPostsModule } from './User/social-posts/social-posts.module';
import { CommentsModule } from './User/social-posts/comments/comments.module';
import { ProfilesModule } from './User/profiles/profiles.module';
import { FollowerModule } from './User/follower/follower.module';
import { FollowingModule } from './user/following/following.module';
import { RestaurantReviewModule } from './User/restaurant-review/restaurant-review.module';
import { ChatModule } from './chat/chat.module';
import { RestaurantModule } from './Admin/restaurant/restaurant/restaurant.module';
import { VoucherModule } from './Admin/restaurant/voucher/voucher.module';
import { QuoteModule } from './Admin/quote/quote.module';
import { CustomerServiceModule } from './User/customer-service/customer-service.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FilterModule } from './filter/filter.module';
import { MulterModule } from '@nestjs/platform-express';
import { DepositMoneyModule } from './admin/restaurant/deposit-money/deposit-money.module';
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
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/plus-one', {
    //   useNewUrlParser: true,
    // }),
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
