import { Module } from '@nestjs/common';
import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Follower, FollowerSchema } from '../../Schemas/follower.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Follower.name,
        schema: FollowerSchema,
      },
    ]),
  ],
  controllers: [FollowerController],
  providers: [FollowerService],
})
export class FollowerModule {}
