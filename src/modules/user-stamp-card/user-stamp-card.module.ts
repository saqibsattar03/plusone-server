import { Module } from '@nestjs/common';
import { UserStampCardService } from './user-stamp-card.service';
import { UserStampCardController } from './user-stamp-card.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserStampCard,
  UserStampCardSchema,
} from '../../data/schemas/user-stamp-card.schema';
import {
  StampCardHistory,
  StampCardHistorySchema,
} from '../../data/schemas/stamp-card-history.schema';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserStampCard.name,
        schema: UserStampCardSchema,
      },
      {
        name: StampCardHistory.name,
        schema: StampCardHistorySchema,
      },
    ]),
    RestaurantModule,
  ],
  providers: [UserStampCardService],
  controllers: [UserStampCardController],
})
export class UserStampCardModule {}
