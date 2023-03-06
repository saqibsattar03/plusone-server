import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../../Schemas/Profile.schema';
import { Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import {
  Restaurant,
  RestaurantDocument,
} from '../../Schemas/restaurant.schema';
import { User, UserDocument } from '../../Schemas/user.schema';

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

  //*** create profile route not needed anymore ***/
  // async createProfile(createProfileDto: CreateProfileDto): Promise<any> {
  //   const user = await this.profileModel.findOne({
  //     userName: createProfileDto.userName,
  //   });
  //   console.log('user name = ', user);
  //   if (!user) {
  //     return this.profileModel.create(createProfileDto);
  //   } else {
  //     return 'user name and email must be unique.This user name or email already taken';
  //   }
  // }

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
  async updateProfile(data: any, id): Promise<ProfileDocument> {
    console.log('data = ', data);
    return this.profileModel.findByIdAndUpdate(id, data);
  }
  async removeProfile(profileId): Promise<ProfileDocument> {
    const profile = await this.profileModel.findById(profileId);
    await profile.remove();
    return profile;
  }
  async getNearByRestaurant(longitude: number, latitude: number): Promise<any> {
    console.log('longitude = ', longitude);
    console.log('latitude = ', latitude);
    const distance = [];
    distance[0] = longitude;
    distance[1] = latitude;
    return this.restaurantModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [distance[0], distance[1]],
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
