import { Module } from '@nestjs/common';
import { FollowingController } from './following.controller';
import { FollowingService } from './following.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Following,
  FollowingSchema,
} from '../../data/schemas/following.schema';
import { FollowerModule } from '../follower/follower.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Following.name,
        schema: FollowingSchema,
      },
    ]),
    FollowerModule,
  ],
  controllers: [FollowingController],
  providers: [FollowingService],
  exports: [FollowingService],
})
export class FollowingModule {}
