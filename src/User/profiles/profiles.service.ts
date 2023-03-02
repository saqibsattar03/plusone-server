import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../../Schemas/Profile.schema';
import { Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import {} from '../../Schemas/redeemVoucher.schema';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<any> {
    const user = await this.profileModel.findOne({
      userName: createProfileDto.userName,
    });
    console.log('user name = ', user);
    if (!user) {
      return this.profileModel.create(createProfileDto);
    } else {
      return 'user name and email must be unique.This user name or email already taken';
    }
  }

  async getSingleProfile(userId): Promise<ProfileDocument> {
    return this.profileModel.findById({ _id: userId });
  }

  async fetchProfileUsingToken(email): Promise<any> {
    const fetchedUser = await this.profileModel.findOne({ email: email });
    if (!fetchedUser)
      return 'You have successfully logged in. Complete Your profile';
    return fetchedUser;
  }
  async updateProfile(data: any, id): Promise<ProfileDocument> {
    return this.profileModel.findByIdAndUpdate(id, data);
  }

  async removeProfile(profileId): Promise<ProfileDocument> {
    const profile = await this.profileModel.findById(profileId);
    await profile.remove();
    return profile;
  }
}
