import { Module } from '@nestjs/common';
import { FcmController } from './fcm.controller';
import { FcmService } from './fcm.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FcmHistory,
  FcmHistorySchema,
} from '../../data/schemas/fcmHistory.schema';
import { HttpModule } from '@nestjs/axios';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FcmHistory.name,
        schema: FcmHistorySchema,
      },
    ]),
    HttpModule,
    ProfilesModule,
  ],
  controllers: [FcmController],
  providers: [FcmService],
  exports: [FcmService],
})
export class FcmModule {}
