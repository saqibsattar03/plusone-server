import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../../data/schemas/profile.schema';
import mongoose, { Model } from 'mongoose';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';
import { FollowingService } from '../following/following.service';
import { FollowerService } from '../follower/follower.service';
import { SocialPostsService } from '../social-posts/social-posts.service';
import { RestaurantReviewService } from '../restaurant-review/restaurant-review.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Constants } from '../../common/constants';
import {
  comparePassword,
  hashPassword,
} from '../../common/utils/passwordHashing';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    private readonly followeeService: FollowingService,
    private readonly followerService: FollowerService,
    private readonly socialPostService: SocialPostsService,
    private readonly reviewService: RestaurantReviewService,
    private readonly restaurantService: RestaurantService,
  ) {}

  async verifyUser(confirmationCode: string): Promise<any> {
    const verified = await this.profileModel.findOne({
      confirmationCode: confirmationCode,
    });
    if (verified) {
      await this.profileModel.updateOne(
        { confirmationCode: confirmationCode },
        {
          $set: {
            status: Constants.ACTIVE,
            confirmationCode: null,
          },
        },
      );
      // await verified.updateOne({ confirmationCode: null });
      throw new HttpException('Account Activated Successfully', HttpStatus.OK);
    } else
      throw new HttpException(
        'confirmation code expired or invalid',
        HttpStatus.BAD_REQUEST,
      );
  }
  async getUserRewardPointsOrEstimatedSavings(
    userId,
  ): Promise<ProfileDocument> {
    return this.profileModel
      .findById({ _id: userId })
      .select('rewardPoints estimatedSavings');
  }
  async getSingleProfile(userId): Promise<any> {
    return this.profileModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'followings',
          localField: '_id',
          foreignField: 'userId',
          as: 'following',
        },
      },
      {
        $unwind: {
          path: '$following',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'followers',
          localField: '_id',
          foreignField: 'userId',
          as: 'follower',
        },
      },
      {
        $unwind: {
          path: '$follower',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'userId',
          as: 'socialPost',
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          firstname: 1,
          surname: 1,
          email: 1,
          status: 1,
          role: 1,
          profileImage: 1,
          accountType: 1,
          socialLinks: 1,
          tiktokLink: 1,
          instagramLink: 1,
          postAudiencePreference: 1,
          dietRequirements: 1,
          favoriteRestaurants: 1,
          favoriteCuisines: 1,
          favoriteChefs: 1,
          rewardPoints: 1,
          isPremium: 1,
          accountHolderType: 1,
          createdAt: 1,
          updatedAt: 1,
          scopes: 1,
          __v: 1,
          bio: 1,
          estimatedSavings: 1,
          followingCount: {
            $size: {
              $ifNull: ['$following.followings', []],
            },
          },
          followerCount: {
            $size: {
              $ifNull: ['$follower.followers', []],
            },
          },
          socialPostCount: {
            $size: {
              $ifNull: ['$socialPost', []],
            },
          },
        },
      },
    ]);
  }
  async getUserByEmailOrUserName(user): Promise<ProfileDocument> {
    return this.profileModel.findOne({
      $or: [{ email: user.email }, { username: user.email }],
    });
  }

  async getUser(email) {
    console.log(email);
    return this.profileModel
      .findOne({
        $or: [{ email: email }, { username: email }],
      })
      .select('email password accountHolderType status role');
  }
  async fetchProfileUsingToken(user): Promise<any> {
    const fetchedUser = await this.profileModel
      .findOne({
        $or: [{ email: user }, { username: user }],
      })
      .select(['-password', '-confirmationCode', '-createdAt', '-updatedAt']);
    if (!fetchedUser)
      throw new HttpException(
        'no user with entered username or email found',
        HttpStatus.NOT_FOUND,
      );
    return fetchedUser;
  }
  async updateProfile(
    data,
    estimatedSavings = null,
    rewardPoints = null,
  ): Promise<any> {
    console.log(data.userId);
    const profile = await this.profileModel.findById({ _id: data.userId });
    if (!profile) throw new NotFoundException(' Profile does not exist');
    if (profile.role == Constants.USER && profile.status == Constants.PENDING)
      throw new HttpException(
        'Account is still not verified yet',
        HttpStatus.UNAUTHORIZED,
      );

    return this.profileModel.findByIdAndUpdate(
      { _id: data.userId },
      {
        $set: {
          firstname: data.firstname,
          surname: data.surname,
          bio: data.bio,
          instagramLink: data.instagramLink,
          tiktokLink: data.tiktokLink,
          profileImage: data.profileImage,
          favoriteRestaurants: data.favoriteRestaurants,
          favoriteCuisines: data.favoriteCuisines,
          favoriteChefs: data.favoriteChefs,
          dietRequirements: data.dietRequirements,
          scopes: data.scopes,
          rewardPoints: rewardPoints,
          estimatedSavings: estimatedSavings,
          isSkip: data.isSkip,
        },
      },
      {
        new: true,
      },
    );
  }

  // async updateRewardPoints(userId, rewardPoints): Promise<any> {
  //   await this.profileModel.findOneAndUpdate(
  //     { _id: userId },
  //     { rewardPoints: rewardPoints },
  //   );
  // }
  // async updatedEstimatedSavings(userId, estimatedSavings): Promise<any> {
  //   await this.profileModel.findByIdAndUpdate(
  //     {
  //       _id: userId,
  //     },
  //     { estimatedSavings: estimatedSavings },
  //   );
  // }
  async getAllUsers(role: string): Promise<any> {
    if (role == Constants.USER || role == Constants.ADMIN)
      return this.profileModel.find({ role });
    return this.restaurantService.getAllUsers(role);
    // return this.profileModel.find({ role }).populate('userId');
    // return this.profileModel.aggregate([
    //   {
    //     $match: { role: role },
    //   },
    //   {
    //     $lookup: {
    //       from: 'restaurants',
    //       localField: '_id',
    //       foreignField: 'userId',
    //       as: 'restaurantData',
    //     },
    //   },
    //   {
    //     $unset: ['password', 'confirmationCode'],
    //   },
    // ]);
  }
  async deleteProfile(profileId): Promise<ProfileDocument> {
    const oid = new mongoose.Types.ObjectId(profileId);
    const profile = await this.profileModel.findById(profileId);
    if (!profile) throw new NotFoundException(' Profile does not exist');
    await this.socialPostService.deleteAllPostsOfSingleUser(oid);
    await this.reviewService.deleteAllReviewsOfUser(oid);
    await this.socialPostService.removeUserLikes(oid);
    await this.followeeService.deleteAllFollwees(oid);
    await this.followerService.deleteAllFollowers(oid);
    await this.profileModel.findByIdAndUpdate(profileId, {
      status: Constants.DELETED,
    });
    throw new HttpException('profile deleted successfully', HttpStatus.OK);
  }
  async getAllPublicProfile(
    paginationDto: PaginationDto,
  ): Promise<ProfileDocument[]> {
    const { limit, offset } = paginationDto;
    return this.profileModel
      .find(
        { accountType: Constants.PUBLIC },
        {},
        { skip: offset, take: limit },
      )
      .select(['-createdAt', '-updatedAt', '-rewardPoints']);
  }
  async restaurantFilters(data, paginationQuery): Promise<any> {
    return this.restaurantService.restaurantFilters(data, paginationQuery);
  }
  async resetPassword(user, enteredPassword) {
    const encryptedPassword = await hashPassword(enteredPassword);
    await this.profileModel.updateOne(
      { _id: user._id },
      { password: encryptedPassword },
    );
  }

  // async getUserByEmailAndPassword(email, password): Promise<any> {
  //   const user = this.profileModel
  //     .findOne({
  //       $or: [{ email: email }, { username: email }],
  //     })
  //     .select('password');
  //   const passwordValid = await bcrypt.compare(password, user.password);
  //   if (user && passwordValid) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // const passwordValid = await bcrypt.compare(password, user.password);
  // if (user && passwordValid) {
  //   const { password, ...result } = user;
  //   return result;
  // }
  // return null;
  // }
  async changePassword(data): Promise<any> {
    const user = await this.profileModel
      .findOne({ _id: data.userId })
      .select('password');
    if (!user) throw new HttpException('use not found', HttpStatus.NOT_FOUND);
    const isValidPassword = await comparePassword(
      data.oldPassword,
      user.password,
    );
    if (!isValidPassword)
      throw new HttpException(
        'Old Password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    const hashedPassword = await hashPassword(data.newPassword);
    const differentPassword = await comparePassword(
      data.oldPassword,
      hashedPassword,
    );
    if (!differentPassword) {
      user.password = hashedPassword;
      await user.save();
      throw new HttpException('Password Changed Successfully', HttpStatus.OK);
    } else
      throw new HttpException(
        'old password and new password can not be same',
        HttpStatus.FORBIDDEN,
      );
  }

  /*** temporary route ***/
  async changeUserStatus(userId): Promise<any> {
    return this.profileModel.findOneAndUpdate(
      { _id: userId },
      { status: 'ACTIVE' },
      { new: true },
    );
  }
  async filterUserByName(username): Promise<any> {
    const regex = new RegExp(username, 'i');
    return this.profileModel
      .find({ username: regex })
      .where({ role: Constants.USER })
      .select('_id username firstname surname profileImage');
  }
}
