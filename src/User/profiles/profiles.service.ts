import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../../Schemas/Profile.schema';
import { Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import {
  RedeemRestaurant,
  RedeemRestaurantDocument,
} from '../../Schemas/redeemRestaurant.schema';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(RedeemRestaurant.name)
    private readonly redeemedRestaurantModel: Model<RedeemRestaurantDocument>,
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
      return 'user name and email must be unique.This user name or email already taken';
    }
  }

  async getSingleProfile(userId): Promise<ProfileDocument> {
    const singleUser = await this.profileModel.findById({ _id: userId });
    return singleUser;
  }

  async fetchProfileUsingToken(email): Promise<any> {
    const fetchedUser = await this.profileModel.findOne({ email: email });
    if (!fetchedUser)
      return 'You have successfully logged in. Complete Your profile';
    return fetchedUser;
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

  async redeemedRestaurants(userId, restaurantId, voucherId): Promise<any> {
    const res = await this.redeemedRestaurantModel.findOne({ userId: userId });
    if (!res) {
      console.log('inside if condition');
      const restaurant = await this.redeemedRestaurantModel.create({
        userId: userId,
      });
      await restaurant.updateOne({
        $push: { restaurantId: restaurantId, voucherId: voucherId },
      });
    } else if (res) {
      if (
        !res.restaurantId.includes(restaurantId) &&
        !res.voucherId.includes(voucherId)
      ) {
        await this.redeemedRestaurantModel.updateOne({
          $push: { restaurantId: restaurantId, voucherId: voucherId },
        });
      } else {
        return 'already redeemed';
      }
    }
  }
}
