import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Following, FollowingDocument } from '../../Schemas/following.schema';
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
        await this.followingModel.updateOne({
          $push: { followings: followeeId },
        });
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
  async getAllFollowees(userId): Promise<any> {
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
        $project: {
          'followings._id': 1,
          'followings.firstName': 1,
          'followings.surName': 1,
          'followings.profileImage': 1,
        },
      },
      {
        $unset: ['_id'],
      },
    ]);
  }
}
