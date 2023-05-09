import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Invitation,
  InvitationDocument,
} from '../../data/schemas/invitation.schema';
import { Model } from 'mongoose';
import { InvitationDto } from '../../data/dtos/invitation.dto';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class InvitationService {
  constructor(
    @InjectModel(Invitation.name)
    private readonly invitationModel: Model<InvitationDocument>,

    private readonly profileService: ProfilesService,
  ) {}
  async sendInvite(invitationDto: InvitationDto): Promise<any> {
    console.log(invitationDto);
    const link = await this.invitationModel.create(invitationDto);
    if (link) {
      const rPoints =
        await this.profileService.getUserRewardPointsOrEstimatedSavings(
          link.sharedBy,
        );
      const data = {
        userId: link.sharedBy,
      };
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
