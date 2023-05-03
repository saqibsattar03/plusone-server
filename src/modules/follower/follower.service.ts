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
        await this.followerModel.updateOne(
          { userId: userId },
          {
            $push: { followers: followerId },
          },
        );
      }
    }
    throw new HttpException('Follower Added Successfully', HttpStatus.OK);
  }
  async removeFollower(userId, followerId): Promise<any> {
    console.log('userId = ', userId);
    const res = await this.followerModel.findOne({ userId: userId });
    if (!res) throw new HttpException('no user found', HttpStatus.NOT_FOUND);
    else if (res) {
      if (res.followers.includes(followerId)) {
        await this.followerModel.findOneAndUpdate(
          { userId: userId },
          {
            $pull: { followers: new mongoose.Types.ObjectId(followerId) },
          },
        );
        // await this.followerModel.updateOne({
        //   $pull: { followers: new mongoose.Types.ObjectId(followerId) },
        // });
      } else
        throw new HttpException('no such follower found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('follower removed successfully', HttpStatus.OK);
  }
  async getAllFollowers(userId): Promise<any> {
    console.log('here followers route called');
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
        $lookup: {
          from: 'followings',
          let: {
            uId: new mongoose.Types.ObjectId(userId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$userId', '$$uId'],
                },
              },
            },
          ],
          as: 'followed',
        },
      },
      {
        $unwind: {
          path: '$followed',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: '$followers._id',
          firstname: '$followers.firstname',
          surname: '$followers.surname',
          username: '$followers.username',
          profileImage: '$followers.profileImage',
          userFollowed: {
            $cond: {
              if: {
                $eq: ['$followed', null],
              },
              then: false,
              else: {
                $cond: {
                  if: {
                    $in: ['$followers._id', '$followed.followings'],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          },
          // userFollowed: {
          //   $cond: {
          //     if: {
          //       $in: ['$followers._id', '$followed.followings'],
          //     },
          //     then: true,
          //     else: false,
          //   },
          // },
        },
      },
    ]);
  }
  async deleteAllFollowers(userId): Promise<any> {
    return this.followerModel.findOneAndDelete({ userId: userId });
  }
}
