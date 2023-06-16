import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Following,
  FollowingDocument,
} from '../../data/schemas/following.schema';
import mongoose, { Model } from 'mongoose';
import { FollowerService } from '../follower/follower.service';
import { FcmService } from '../fcm/fcm.service';
import { ProfilesService } from '../profiles/profiles.service';
import {
  FollowRequest,
  FollowRequestDocument,
} from '../../data/schemas/follow-request.schema';
import { Constants } from '../../common/constants';

@Injectable()
export class FollowingService {
  constructor(
    @InjectModel(Following.name)
    private readonly followingModel: Model<FollowingDocument>,

    @InjectModel(FollowRequest.name)
    private readonly followRequestModel: Model<FollowRequestDocument>,

    @Inject(forwardRef(() => FollowerService))
    private readonly followerService: FollowerService,

    @Inject(forwardRef(() => FcmService))
    protected readonly fcmService: FcmService,

    @Inject(forwardRef(() => ProfilesService))
    protected readonly profileService: ProfilesService,
  ) {}

  async SingleUserFollowCheck(currentUser, searchedUser): Promise<any> {
    console.log('currentUser = ', currentUser);
    console.log('searchedUser = ', searchedUser);
    const res = await this.followingModel.findOne({ userId: currentUser });
    if (!res) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    const arr = res.followings.map((id) => id.toString());
    const followed = arr.some((id) => id === searchedUser);
    return followed ? { followed: true } : { followed: false };
  }
  async removeFollowee(userId, followeeId): Promise<any> {
    const res = await this.followingModel.findOne({ userId: userId });
    if (!res)
      throw new HttpException('no such user found', HttpStatus.NOT_FOUND);
    else if (res) {
      const fId = new mongoose.Types.ObjectId(followeeId);
      if (res.followings.includes(followeeId)) {
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
    ]);
  }

  //*** add following routes below ***//
  async addFollowee(userId, followeeId, isPrivate = false): Promise<any> {
    const res = await this.followingModel.findOne({ userId: userId });
    if (!res) {
      const user = await this.followingModel.create({ userId: userId });
      await user.updateOne({ $push: { followings: followeeId } });
      await this.followRequestModel.findOneAndDelete({
        requestedFrom: new mongoose.Types.ObjectId(userId),
        requestedTo: new mongoose.Types.ObjectId(followeeId),
      });
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
        await this.followRequestModel.findOneAndDelete({
          requestedFrom: new mongoose.Types.ObjectId(userId),
          requestedTo: new mongoose.Types.ObjectId(followeeId),
        });
      }
    }
    //*** sending follow request accepted notification ***//
    if (isPrivate) {
      const id = await this.profileService.getUserFields(userId);
      const userData = await this.profileService.getUserFields(followeeId);
      const notification = {
        email: id.email,
        title: 'New Follow Request! 👋',
        body: `🎉 Alert! ${userData.firstname} ${userData.surname} Accepted Your Follow Request 👀`,
        profileImage: userData.profileImage,
      };
      await this.fcmService.sendSingleNotification(notification, userId);
    }
    return { isRequested: false };
  }
  async followRequest(data) {
    const user = await this.profileService.getUserFields(data.requestedTo);
    const user1 = await this.profileService.getUserFields(data.requestedFrom);
    const res = await this.followRequestModel.findOne({
      requestedFrom: data.requestedFrom,
      requestedTo: data.requestedTo,
    });
    if (!res) {
      if (user.accountType == Constants.PRIVATE) {
        console.log('here in private account type ::');
        await this.followRequestModel.create(data);
        const notification = {
          email: user.email,
          title: 'New Follow Request! 👋',
          body: `🎉 Alert! ${user1.firstname} ${user1.surname} Requested To Follow You 👀`,
          profileImage: user1.profileImage,
        };
        await this.fcmService.sendSingleNotification(
          notification,
          data.requestedFrom,
        );
        return { isRequested: true };
      } else {
        const notification = {
          email: user.email,
          title: 'New Follow Request! 👋',
          body: `🎉 Alert! ${user1.firstname} ${user1.surname} Started To Follow You 👀`,
          profileImage: user1.profileImage,
        };
        await this.fcmService.sendSingleNotification(
          notification,
          data.requestedFrom,
        );
        //*** calling addFollowee method to complete the request ***//
        return await this.addFollowee(
          data.requestedFrom,
          data.requestedTo,
          false,
        );
      }
    } else throw new HttpException('Already Requested', HttpStatus.BAD_REQUEST);
  }
  async followRequestStatus(data): Promise<any> {
    if (data.status == Constants.ACCEPTED) {
      await this.addFollowee(data.requestedTo, data.requestedFrom, true);
    } else if (data.status == Constants.REJECTED) {
      await this.followRequestModel.findOneAndDelete({
        requestedFrom: new mongoose.Types.ObjectId(data.requestedTo),
        requestedTo: new mongoose.Types.ObjectId(data.requestedFrom),
      });
    }
    throw new HttpException('Request Rejected', HttpStatus.OK);
  }
  async getAllFollowRequest(userId): Promise<any> {
    return this.followRequestModel
      .find({ requestedTo: userId })
      .select('-_id -requestedTo')
      .populate({
        path: 'requestedFrom',
        select: 'firstname surname profileImage',
      });
  }
  async checkFollowRequest(data): Promise<any> {
    const res = await this.followRequestModel.findOne({
      requestedFrom: data.requestedFrom,
      requestedTo: data.requestedTo,
    });
    if (res) return { requestSent: true };
    else return { requestSent: false };
  }
}
