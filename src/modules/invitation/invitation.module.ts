import { Module } from '@nestjs/common';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Invitation,
  InvitationSchema,
} from '../../data/schemas/invitation.schema';
import { ProfilesModule } from '../profiles/profiles.module';
import { FcmModule } from '../fcm/fcm.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Invitation.name,
        schema: InvitationSchema,
      },
    ]),
    ProfilesModule,
    FcmModule,
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
