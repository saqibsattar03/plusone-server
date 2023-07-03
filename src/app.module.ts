import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocialPostsModule } from './modules/social-posts/social-posts.module';
import { CommentsModule } from './modules/social-posts/comments/comments.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { FollowerModule } from './modules/follower/follower.module';
import { FollowingModule } from './modules/following/following.module';
import { RestaurantReviewModule } from './modules/restaurant-review/restaurant-review.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { VoucherModule } from './modules/voucher/voucher.module';
import { QuoteModule } from './modules/quote/quote.module';
import { CustomerServiceModule } from './modules/customer-service/customer-service.module';
import { AuthModule } from './common/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { DepositMoneyModule } from './modules/deposit-money/deposit-money.module';
import { DbModule } from './common/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { multerConfig } from './common/configs/image.config';
import { InvitationModule } from './modules/invitation/invitation.module';
import { FcmModule } from './modules/fcm/fcm.module';
import { TransactionHistoryModule } from './modules/transaction-history/transaction-history.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { MailModule } from './modules/mail/mail.module';
import * as process from 'process';
import { StampCardModule } from './modules/restaurant-stamp-card/stamp-card.module';
import { UserStampCardModule } from './modules/user-stamp-card/user-stamp-card.module';

@Module({
  imports: [
    AwsSdkModule.forRoot(),
    //To use .env variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    SocialPostsModule,
    DbModule,
    CommentsModule,
    ProfilesModule,
    FollowerModule,
    FollowingModule,
    RestaurantReviewModule,
    RestaurantModule,
    VoucherModule,
    QuoteModule,
    CustomerServiceModule,
    AuthModule,
    MulterModule.register(multerConfig),
    DepositMoneyModule,
    InvitationModule,
    FcmModule,
    TransactionHistoryModule,
    SubscriptionModule,
    MailModule,
    StampCardModule,
    UserStampCardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
