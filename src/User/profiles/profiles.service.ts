import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../../Schemas/Profile.schema';
import mongoose, { Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import {
  Restaurant,
  RestaurantDocument,
} from '../../Schemas/restaurant.schema';
import { User, UserDocument } from '../../Schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  async getSingleProfile(userId): Promise<ProfileDocument> {
    return this.profileModel.findById({ _id: userId });
  }

  async getUserByEmailOrUserName(user): Promise<ProfileDocument> {
    return this.profileModel.findOne({
      $or: [{ email: user.email }, { userName: user.email }],
    });
  }

  async fetchProfileUsingToken(email): Promise<any> {
    const fetchedUser = await this.profileModel.findOne({
      $or: [{ email: email }, { userName: email }],
    });
    if (!fetchedUser) {
      return 'You have successfully logged in. Complete Your profile';
    }
    return fetchedUser;
  }
  async updateProfile(
    data: UpdateProfileDto,
    profileId,
  ): Promise<ProfileDocument> {
    const profile = await this.profileModel.findById({ _id: profileId });
    if (!profile) throw new NotFoundException(' Profile does not exist');

    return this.profileModel.findByIdAndUpdate(profileId, data);
  }
  async removeProfile(profileId): Promise<ProfileDocument> {
    const profile = await this.profileModel.findById(profileId);
    await profile.remove();
    return profile;
  }
  async getNearByRestaurant(longitude, latitude): Promise<any> {
    return this.restaurantModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distanceFromMe',
          maxDistance: 1000 * 1609.34,
          distanceMultiplier: 1 / 1609.34,
          spherical: true,
        },
      },
    ]);
  }

  async getAllPublicProfile(): Promise<ProfileDocument[]> {
    return this.profileModel.find({ accountType: 'public' });
  }

  //*** verify voucher code here ***//
}
