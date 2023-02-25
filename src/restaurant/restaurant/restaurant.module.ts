import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from '../../Schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Restaurant.name,
        schema: RestaurantSchema,
      },
    ]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
