import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follower, FollowerDocument } from '../../data/schemas/follower.schema';
import mongoose, { Model } from 'mongoose';

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
    throw new HttpException('Follower Added Successfully', HttpStatus.OK);
  }
  async removeFollower(userId, followerId): Promise<any> {
    const res = await this.followerModel.findOne({ userId: userId });
    if (!res) throw new HttpException('no user found', HttpStatus.NOT_FOUND);
    else if (res) {
      if (res.followers.includes(followerId)) {
        await this.followerModel.updateOne({
          $pull: { followers: followerId },
        });
      } else
        throw new HttpException('no such follower found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('follower removed successfully', HttpStatus.OK);
  }
  async getAllFollowers(userId): Promise<any> {
    console.log('user id  = ', userId);
    const oid = new mongoose.Types.ObjectId(userId);
    return this.followerModel.aggregate([
      {
        $match: { userId: oid },
      },
      {
        $lookup: {
          from: 'profiles',
          let: { followerId: '$followers' },
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$_id', '$$followerId'] },
              },
            },
          ],
          as: 'followers',
        },
      },
      {
        $unwind: '$followers',
      },
      {
        $project: {
          _id: '$followings._id',
          firstname: '$followers.firstname',
          surname: '$followers.surname',
          username: '$followers.username',
          profileImage: '$followers.profileImage',
        },
      },
    ]);
  }

  async deleteAllFollowers(userId): Promise<any> {
    return this.followerModel.findOneAndDelete({ userId: userId });
  }
}
