import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follower, FollowerDocument } from '../../Schemas/follower.schema';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../../Schemas/Profile.schema';

@Injectable()
export class FollowerService {
  constructor(
    @InjectModel(Follower.name)
    private readonly followerModel: Model<FollowerDocument>,
  ) {}

  async addFollower(userId, followerId): Promise<any> {
    const res = await this.followerModel.findOne({ userId: userId });
    if (!res) {
      const user = await this.followerModel.create({
        userId: userId,
      });
      await user.updateOne({ $push: { followers: followerId } });
    } else if (res) {
      if (!res.followers.includes(followerId)) {
        await this.followerModel.updateOne({
          $push: { followers: followerId },
        });
      }
    }
    return res;
  }
  async removeFollower(userId, followerId): Promise<any> {
    const res = await this.followerModel.findOne({ userId: userId });
    if (!res) {
      return 'no user found';
    } else if (res) {
      if (res.followers.includes(followerId)) {
        await this.followerModel.updateOne({
          $pull: { followers: followerId },
        });
      } else {
        return 'no such follower found';
      }
    }
    return res;
  }
  async getAllFollowers(userId): Promise<any> {
    const followers = await this.followerModel
      .findOne({ userId: userId })
      .populate('followers', 'userName');
    return followers;
  }
}
