import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Following,
  FollowingDocument,
} from '../../data/schemas/following.schema';
import mongoose, { Model } from 'mongoose';
import { FollowerService } from '../follower/follower.service';

@Injectable()
export class FollowingService {
  constructor(
    @InjectModel(Following.name)
    private readonly followingModel: Model<FollowingDocument>,
    private readonly followerService: FollowerService,
  ) {}
  async addFollowee(userId, followeeId): Promise<any> {
    const res = await this.followingModel.findOne({ userId: userId });
    if (!res) {
      const user = await this.followingModel.create({ userId: userId });
      await user.updateOne({ $push: { followings: followeeId } });
      await this.followerService.addFollower(followeeId, userId);
    } else if (res) {
      if (!res.followings.includes(followeeId)) {
        await this.followingModel.updateOne(
          { userId: userId },
          {
            $push: { followings: followeeId },
          },
        );
        await this.followerService.addFollower(followeeId, userId);
      } else
        throw new HttpException('already following', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('follwee added successfully', HttpStatus.OK);
  }
  async removeFollowee(userId, followeeId): Promise<any> {
    console.log('here remove followee');
    const res = await this.followingModel.findOne({ userId: userId });
    if (!res)
      throw new HttpException('no such user found', HttpStatus.NOT_FOUND);
    else if (res) {
      const fId = new mongoose.Types.ObjectId(followeeId);
      if (res.followings.includes(followeeId)) {
        console.log('here res found');
        await this.followingModel.findOneAndUpdate(
          { userId: userId },
          {
            $pull: { followings: fId },
          },
        );
        await this.followerService.removeFollower(followeeId, userId);
      } else
        throw new HttpException('no such followee found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('Followee Removed Successfully', HttpStatus.OK);
  }
  async getAllFollowings(userId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(userId);
    return this.followingModel.aggregate([
      {
        $match: { userId: oid },
      },
      {
        $lookup: {
          from: 'profiles',
          let: { followeeId: '$followings' },
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$_id', '$$followeeId'] },
              },
            },
          ],
          as: 'followings',
        },
      },
      {
        $unwind: '$followings',
      },
      {
        $lookup: {
          from: 'followers',
          let: { uId: oid },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$userId', '$$uId'],
                },
              },
            },
          ],
          as: 'follower',
        },
      },
      {
        $project: {
          follower: '$follower',
          _id: '$followings._id',
          username: '$followings.username',
          firstname: '$followings.firstname',
          surname: '$followings.surname',
          profileImage: '$followings.profileImage',
        },
      },
    ]);
  }
  async deleteAllFollwees(userId): Promise<any> {
    return this.followingModel.findOneAndDelete({ userId: userId });
  }
  async getFollowingIds(userId): Promise<any> {
    const oi = new mongoose.Types.ObjectId(userId);
    return this.followingModel.aggregate([
      {
        $match: {
          userId: oi,
        },
      },
      // {
      //   $unwind: '$followings',
      // },
      // {
      //   $project: {
      //     followingId: { $arrayElemAt: ['$followings', 0] },
      //   },
      // },
    ]);
  }
}
