import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Following,
  FollowingDocument,
} from '../../data/schemas/following.schema';
import mongoose, { Model } from 'mongoose';

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
        await this.followingModel.updateOne(
          { userId: userId },
          {
            $push: { followings: followeeId },
          },
        );
      } else
        throw new HttpException('already following', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('follwee added successfully', HttpStatus.OK);
  }
  async removeFollowee(userId, followeeId): Promise<any> {
    const res = await this.followingModel.findOne({ userId: userId });
    if (!res)
      throw new HttpException('no such user found', HttpStatus.NOT_FOUND);
    else if (res) {
      if (res.followings.includes(followeeId)) {
        await this.followingModel.updateOne({
          $pull: { followings: followeeId },
        });
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
          // localField: 'userId',
          // foreignField: 'userId',
          as: 'follower',
        },
      },
      // {
      //   $unwind: '$follower',
      // },
      {
        $project: {
          follower: '$follower',
          firstname: '$followings.firstname',
          surname: '$followings.surname',
          profileImage: '$followings.profileImage',
          // followed: {
          //   $cond: {
          //     if: {
          //       $in: ['$userId', '$follower.followers'],
          //     },
          //     then: true,
          //     else: false,
          //   },
          // },
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
