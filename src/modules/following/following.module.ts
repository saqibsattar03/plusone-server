import { forwardRef, Module } from '@nestjs/common';
import { FollowingController } from './following.controller';
import { FollowingService } from './following.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Following,
  FollowingSchema,
} from '../../data/schemas/following.schema';
import { FollowerModule } from '../follower/follower.module';
import { FcmModule } from '../fcm/fcm.module';
import { ProfilesModule } from '../profiles/profiles.module';
import {
  FollowRequest,
  FollowRequestSchema,
} from '../../data/schemas/follow-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Following.name,
        schema: FollowingSchema,
      },
      {
        name: FollowRequest.name,
        schema: FollowRequestSchema,
      },
    ]),
    forwardRef(() => FollowerModule),
    forwardRef(() => FcmModule),
    forwardRef(() => ProfilesModule),
  ],
  controllers: [FollowingController],
  providers: [FollowingService],
  exports: [FollowingService],
})
export class FollowingModule {}
