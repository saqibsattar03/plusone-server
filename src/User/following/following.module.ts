import { Module } from '@nestjs/common';
import { FollowingController } from './following.controller';
import { FollowingService } from './following.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowerSchema } from '../../Schemas/follower.schema';
import { Following, FollowingSchema } from '../../Schemas/following.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Following.name,
        schema: FollowingSchema,
      },
    ]),
  ],
  controllers: [FollowingController],
  providers: [FollowingService],
})
export class FollowingModule {}
