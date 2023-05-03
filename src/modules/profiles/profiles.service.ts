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
import * as bcrypt from 'bcrypt';
import { Constants } from '../../common/constants';
import { generateToken } from '../../common/utils/generateToken';

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

  async createUser(userDto: any) {
    const saltOrRounds = 10;
    userDto.password = await bcrypt.hash(userDto.password, saltOrRounds);
    if (userDto.role == Constants.ADMIN || userDto.role == Constants.MERCHANT)
      userDto.accountHolderType = null;
    const userName = await this.profileModel.findOne({
      username: userDto.username,
    });
    if (userName)
      throw new HttpException(
        'A user with this email already exists.',
        HttpStatus.UNAUTHORIZED,
      );
    const user = await this.profileModel.findOne({
      email: userDto.email,
    });
    if (user)
      throw new HttpException('Email already exist', HttpStatus.UNAUTHORIZED);
    const newUser = new this.profileModel({
      firstname: userDto.firstname,
      surname: userDto.surname,
      username: userDto.username,
      email: userDto.email,
      password: userDto.password,
      accountHolderType: userDto.accountHolderType,
      role: userDto.role,
      scopes: userDto.scopes,
      status: userDto.status,
      confirmationCode: await generateToken(),
    });
    await newUser.save();
    if (newUser.role == Constants.MERCHANT) return newUser;
    // sendConfirmationEmail(newUser.email, newUser.confirmationCode);
    throw new HttpException(
      'Account Created Successfully. Please Confirm Your Email to Active Your Account. Check Your Email for Confirmation',
      HttpStatus.OK,
    );
  }

  async verifyUser(confirmationCode: string): Promise<any> {
    const verified = await this.profileModel.findOne({
      confirmationCode: confirmationCode,
    });
    if (verified) {
      await verified.updateOne({ status: Constants.ACTIVE });
      await verified.updateOne({ confirmationCode: null });
      throw new HttpException('Account Activated Successfully', HttpStatus.OK);
    } else
      throw new HttpException(
        'confirmation code expired or invalid',
        HttpStatus.BAD_REQUEST,
      );
  }

  async getUserRewardPoints(userId): Promise<ProfileDocument> {
    return this.profileModel.findById({ _id: userId }).select('rewardPoints');
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
  async updateProfile(data): Promise<any> {
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
          isSkip: data.isSkip,
        },
      },
      {
        new: true,
      },
    );
  }
  async updateRewardPoints(userId, rewardPoints): Promise<any> {
    await this.profileModel.findOneAndUpdate(
      { _id: userId },
      { rewardPoints: rewardPoints },
    );
  }
  async updatedEstimatedSavings(userId, estimatedSavings): Promise<any> {
    await this.profileModel.findByIdAndUpdate(
      {
        _id: userId,
      },
      { estimatedSavings: estimatedSavings },
    );
  }
  async getAllUsers(role: string): Promise<any> {
    return this.profileModel.aggregate([
      {
        $match: { role: role },
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: '_id',
          foreignField: 'userId',
          as: 'restaurantData',
        },
      },
      {
        $unset: ['password', 'confirmationCode'],
      },
    ]);
  }
  async removeProfile(profileId): Promise<ProfileDocument> {
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
      .find({ accountType: 'PUBLIC' }, {}, { skip: offset, take: limit })
      .select([
        '-password',
        '-confirmationCode',
        '-createdAt',
        '-updatedAt',
        '-rewardPoints',
      ]);
  }
  async restaurantFilters(data, paginationQuery): Promise<any> {
    return this.restaurantService.restaurantFilters(data, paginationQuery);
  }
  async resetPassword(user, password) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    await this.profileModel.updateOne(
      { _id: user._id },
      { password: encryptedPassword },
    );
  }
  async getUser(email: string) {
    return this.profileModel
      .findOne({
        $or: [{ email: email }, { username: email }],
      })
      .select('email password');
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
    const user = await this.profileModel.findOne({ _id: data.userId });
    if (!user) throw new HttpException('use not found', HttpStatus.NOT_FOUND);
    const isValidPassword = await bcrypt.compare(
      data.oldPassword,
      user.password,
    );
    if (!isValidPassword)
      throw new HttpException(
        'Old Password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    const differentPassword = await bcrypt.compare(
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
