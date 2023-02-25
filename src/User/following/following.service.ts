import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Following, FollowingDocument } from '../../Schemas/following.schema';
import { Model } from 'mongoose';

@Injectable()
export class FollowingService {
  constructor(
    @InjectModel(Following.name)
    private readonly followingModel: Model<FollowingDocument>,
  ) {}

  async addFollowee(userId, followeeId): Promise<any> {
    const res = await this.followingModel.findOne({ userId: userId });
    if (!res) {
      const user = await this.followingModel.create({ userId: userId });
      await user.updateOne({ $push: { followings: followeeId } });
    } else if (res) {
      if (!res.followings.includes(followeeId)) {
        await this.followingModel.updateOne({
          $push: { followings: followeeId },
        });
      } else {
        console.log('already following');
      }
    }
    return res;
  }
  async removeFollowee(userId, followeeId): Promise<any> {
    const res = await this.followingModel.findOne({ userId: userId });
    if (!res) return 'no such user found';
    else if (res) {
      if (res.followings.includes(followeeId)) {
        await this.followingModel.updateOne({
          $pull: { followings: followeeId },
        });
      } else return 'no such followee found';
    }
    return res;
  }
  async getAllFollowees(userId): Promise<any> {
    return this.followingModel
      .findOne({ useId: userId })
      .populate('followings', 'userName');
  }
}
