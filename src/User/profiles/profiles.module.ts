import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../../Schemas/Profile.schema';
import {} from '../../Schemas/redeemVoucher.schema';
import { Restaurant, RestaurantSchema } from '../../Schemas/restaurant.schema';
import { User, UserSchema } from '../../Schemas/user.schema';
import { MulterModule } from '@nestjs/platform-express';

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
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
