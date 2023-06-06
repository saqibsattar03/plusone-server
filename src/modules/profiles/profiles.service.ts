import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
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
} from '../../common/utils/passwordHashing.util';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @Inject(forwardRef(() => FollowingService))
    private readonly followeeService: FollowingService,
    private readonly followerService: FollowerService,
    @Inject(forwardRef(() => SocialPostsService))
    private readonly socialPostService: SocialPostsService,
    @Inject(forwardRef(() => RestaurantReviewService))
    private readonly reviewService: RestaurantReviewService,
    @Inject(forwardRef(() => RestaurantService))
    private readonly restaurantService: RestaurantService,
  ) {}
  async updateProfile(
    data,
    estimatedSavings = null,
    rewardPoints = null,
  ): Promise<any> {
    console.log('data = ', data);
    //*** uncomment it when integrating real subscription ***//
    // const userEarnings = await this.getUserEarnings(data.userId);

    const profile = await this.profileModel.findOne({
      $or: [{ _id: data.userId }, { email: data.email }],
    });
    if (!profile) throw new NotFoundException(' Profile does not exist');
    if (profile.role == Constants.USER && profile.status == Constants.PENDING)
      throw new HttpException(
        'Account is still not verified yet',
        HttpStatus.UNAUTHORIZED,
      );

    return this.profileModel.findOneAndUpdate(
      { $or: [{ _id: data.userId }, { email: data.email }] },
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

          //*** uncomment these when integrating real subscription ***//

          // rewardPoints: rewardPoints ?? userEarnings.rewardPoints,
          rewardPoints: rewardPoints,
          // estimatedSavings: estimatedSavings ?? userEarnings.estimatedSavings,
          estimatedSavings: estimatedSavings,
          isSkip: data.isSkip,
          accountType: data.accountType,
          postAudiencePreference: data.postAudiencePreference,
          fcmToken: data.fcmToken,

          //*** subscription fields ***//

          isPremium: data.isPremium,
          productId: data.productId,
          purchasedAt: data.purchasedAt,
          expirationAt: data.expirationAt,
        },
      },
      {
        new: true,
      },
    );
  }

  async getUserFields(userId): Promise<ProfileDocument> {
    return this.profileModel
      .findOne({
        $or: [{ _id: userId }, { email: userId }],
      })
      .select(
        'rewardPoints estimatedSavings email firstname surname profileImage productId purchasedAt expirationAt isPremium accountType accountHolderType',
      );
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
  async getUser(email) {
    return this.profileModel
      .findOne({
        $or: [{ email: email }, { username: email }],
      })
      .select(
        'email password accountHolderType status role fcmToken firstname',
      );
  }
  async fetchProfileUsingToken(user): Promise<any> {
    const fetchedUser = await this.profileModel.findOne({
      $or: [{ email: user }, { username: user }],
    });
    if (!fetchedUser)
      throw new HttpException(
        'no user with entered username or email found',
        HttpStatus.NOT_FOUND,
      );
    return fetchedUser;
  }
  async getAllUsers(role: string): Promise<any> {
    if (role == Constants.USER || role == Constants.ADMIN)
      return this.profileModel
        .find({
          role: role,
          accountType: { $ne: 'ONLY-ME' },
        })
        .sort({ createdAt: -1 });
    return this.restaurantService.getAllUsers(role);
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
  async filterUserByName(username, userType): Promise<any> {
    const regex = new RegExp(username, 'i');
    return this.profileModel
      .find({
        username: regex,
        accountHolderType: userType,
        status: Constants.ACTIVE,
        accountType: { $ne: 'ONLY-ME' },
      })
      .where({ role: Constants.USER })
      .select('_id username firstname surname profileImage');
  }
  async updateFcmToken(id: string, token: string): Promise<any> {
    return await this.profileModel.findByIdAndUpdate(id, { token }).exec();
  }
}
