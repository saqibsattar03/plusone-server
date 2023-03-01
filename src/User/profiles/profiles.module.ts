import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../../Schemas/Profile.schema';
import {
  RedeemRestaurant,
  RedeemRestaurantSchema,
} from '../../Schemas/redeemRestaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
      {
        name: RedeemRestaurant.name,
        schema: RedeemRestaurantSchema,
      },
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports:[ProfilesService]
})
export class ProfilesModule {}
