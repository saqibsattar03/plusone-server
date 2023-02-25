import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../../Schemas/Profile.schema';
import { Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';

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
      const profile = await this.profileModel.create(createProfileDto);
      return profile;
    } else {
      return 'user name must be unique.This user name already taken';
    }
  }

  async getSingleProfile(userId): Promise<ProfileDocument> {
    const singleUser = await this.profileModel.findById({ _id: userId });
    return singleUser;
  }

  async updateProfile(data: any, id): Promise<ProfileDocument> {
    const updateProfile = await this.profileModel.findByIdAndUpdate(id, data);
    return updateProfile;
  }

  async removeProfile(profileId): Promise<ProfileDocument> {
    const profile = await this.profileModel.findById(profileId);
    await profile.remove();
    return profile;
  }
}
