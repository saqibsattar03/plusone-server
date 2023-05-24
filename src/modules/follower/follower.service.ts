import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follower, FollowerDocument } from '../../data/schemas/follower.schema';
import mongoose, { Model } from 'mongoose';
import { FollowingService } from '../following/following.service';

@Injectable()
export class FollowerService {
  constructor(
    @InjectModel(Follower.name)
    private readonly followerModel: Model<FollowerDocument>,
    @Inject(forwardRef(() => FollowingService))
    private readonly followingService: FollowingService,
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
    return;
    //  throw new HttpException('Follower Added Successfully', HttpStatus.OK);
  }

  async removeFollower(userId, followerId): Promise<any> {
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
      } else
        throw new HttpException('no such follower found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('follower removed successfully', HttpStatus.OK);
  }

  async getAllFollowers(userId): Promise<any> {
    console.log(userId);
    const oid = new mongoose.Types.ObjectId(userId);
    return this.followerModel.aggregate([
      {
        $match: {
          userId: oid,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          let: {
            followerId: '$followers',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$_id', '$$followerId'],
                },
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
            // uId: ObjectId('644a4c7d1913f5e2b20fd596'),
            uId: oid,
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
      // {
      //   $unwind: {
      //     path: '$followed',
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      {
        $lookup: {
          from: 'followrequests',
          let: {
            uId: oid,
            // uId: oid,
            rTo: '$followers._id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$requestedFrom', '$$uId'],
                    },
                    {
                      $eq: ['$requestedTo', '$$rTo'],
                    },
                  ],
                },
              },
            },
          ],
          as: 'requested',
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
          requested: {
            $cond: {
              if: {
                $eq: [
                  {
                    $size: '$requested',
                  },
                  0,
                ],
              },
              then: null,
              else: '$requested',
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          firstname: 1,
          surname: 1,
          username: 1,
          profileImage: 1,
          userFollowed: 1,
          isRequested: {
            $cond: {
              if: {
                $eq: ['$requested', null],
              },
              then: false,
              else: true,
            },
          },
        },
      },
    ]);
  }

  async deleteAllFollowers(userId): Promise<any> {
    return this.followerModel.findOneAndDelete({ userId: userId });
  }
}
