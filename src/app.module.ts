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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
