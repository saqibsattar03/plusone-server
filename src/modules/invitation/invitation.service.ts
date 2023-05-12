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
    const link = await this.invitationModel.create(invitationDto);
    if (link) {
      const rPoints = await this.profileService.getUserEarnings(link.sharedBy);
      console.log(rPoints);
      const data = {
        userId: link.sharedBy,
      };

      //*** send invitation notification ***//
      // const userData = await this.profileService.getUserEarnings(data.userId);
      // console.log(userData);
      // const notification = {
      //   email: userData.email,
      //   title: '🎉 Your Invitation Has Been Accepted!',
      //   body: '🌟 Congratulations! You Have Been Awarded 1 Reward Point 💰',
      // };
      // await this.fcmService.sendSingleNotification(notification);
      await this.profileService.updateProfile(
        data,
        rPoints.estimatedSavings,
        rPoints.rewardPoints + 1,
      );
      throw new HttpException(
        'Invitation Link Shared Successfully',
        HttpStatus.OK,
      );
    }
  }

  async checkInviteLimit(sharedBy: string): Promise<any> {
    return this.invitationModel.find({ sharedBy }).count();
    // return { count ;
  }
}
