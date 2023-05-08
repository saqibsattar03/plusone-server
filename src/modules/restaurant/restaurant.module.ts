import { forwardRef, Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Restaurant,
  RestaurantSchema,
} from '../../data/schemas/restaurant.schema';
import { ProfilesModule } from '../profiles/profiles.module';
import { Tag, TagSchema } from '../../data/schemas/tags.schema';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Restaurant.name,
        schema: RestaurantSchema,
      },
      {
        name: Tag.name,
        schema: TagSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    // forwardRef(() => ProfilesModule),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
