import { forwardRef, Module } from '@nestjs/common';
import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Follower, FollowerSchema } from '../../data/schemas/follower.schema';
import { FollowingModule } from '../following/following.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Follower.name,
        schema: FollowerSchema,
      },
    ]),
    forwardRef(() => FollowingModule),
  ],
  controllers: [FollowerController],
  providers: [FollowerService],
  exports: [FollowerService],
})
export class FollowerModule {}
