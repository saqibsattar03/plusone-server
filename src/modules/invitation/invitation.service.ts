import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Invitation,
  InvitationDocument,
} from '../../data/schemas/invitation.schema';
import { Model } from 'mongoose';
import { InvitationDto } from '../../data/dtos/invitation.dto';
import { ProfilesService } from '../profiles/profiles.service';
import { FcmService } from '../fcm/fcm.service';

@Injectable()
export class InvitationService {
  constructor(
    @InjectModel(Invitation.name)
    private readonly invitationModel: Model<InvitationDocument>,
    private readonly profileService: ProfilesService,
    protected readonly fcmService: FcmService,
  ) {}
  async sendInvite(invitationDto: InvitationDto): Promise<any> {
    console.log('here');
    const link = await this.invitationModel.create(invitationDto);
    console.log('link outside = ', link);
    if (link) {
      console.log('link = ', link);
      //*** shared by data ***//

      const rewardPoints = await this.profileService.getUserFields(
        link.sharedBy,
      );
      console.log('reward points = ', rewardPoints);
      const data = {
        userId: link.sharedBy,
      };
      console.log('data = ', data);
      const senderData = await this.profileService.getUserFields(data.userId);
      console.log('sender data = ', senderData);
      //*** send invitation notification ***//
      const senderNotification = {
        email: senderData.email,
        title: '🎉 Your Invitation Has Been Accepted!',
        body: '🌟 Congratulations! You Have Been Awarded 1 Reward Point 💰',
      };
      await this.fcmService.sendSingleNotification(senderNotification);
      await this.profileService.updateProfile(
        data,
        rewardPoints.estimatedSavings,
        rewardPoints.rewardPoints + 1,
        null,
      );

      //*** recipient Data ***//

      const freeVoucherCount = await this.profileService.getUserFields(
        link.recipient,
      );
      console.log('free voucher count = ', freeVoucherCount);
      const data1 = {
        userId: link.recipient,
      };
      console.log('data1 = ', data1);
      const recipientData = await this.profileService.getUserFields(
        data1.userId,
      );

      console.log('recipient data', recipientData);

      //*** accept invitation notification ***//

      const recipientNotification = {
        email: recipientData.email,
        title: '🎉 Your Account Has Been Created!',
        body: '🌟 Congratulations! You Have Been Awarded 1 Free Voucher 💰',
      };

      await this.fcmService.sendSingleNotification(recipientNotification);

      await this.profileService.updateProfile(
        data1,
        null,
        null,
        freeVoucherCount.freeVoucherCount + 1,
      );
      throw new HttpException(
        'Invitation Link Shared Successfully',
        HttpStatus.OK,
      );
    }
  }

  async checkInviteLimit(sharedBy: string): Promise<any> {
    return this.invitationModel.find({ sharedBy }).count();
  }
}
