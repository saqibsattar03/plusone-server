import { forwardRef, Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Restaurant,
  RestaurantSchema,
} from '../../data/schemas/restaurant.schema';
import { ProfilesService } from '../profiles/profiles.service';
import { ProfilesModule } from '../profiles/profiles.module';
import { ProfileDto } from '../../data/dtos/profile.dto';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Restaurant.name,
        schema: RestaurantSchema,
      },
    ]),
    forwardRef(() => ProfilesModule),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
