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
import { UpdateProfileDto } from '../../data/dtos/profile.dto';
import { FollowingService } from '../following/following.service';
import { FollowerService } from '../follower/follower.service';
import { SocialPostsService } from '../social-posts/social-posts.service';
import { RestaurantReviewService } from '../restaurant-review/restaurant-review.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import * as bcrypt from 'bcrypt';
import { Constants } from '../../common/constants';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    private readonly followeeService: FollowingService,
    private readonly followerService: FollowerService,
    private readonly socialPostService: SocialPostsService,
    private readonly resReviewService: RestaurantReviewService,
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
    const characters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
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
      confirmationCode: token,
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

  async getSingleProfile(userId): Promise<ProfileDocument> {
    return this.profileModel
      .findById({ _id: userId })
      .select('-password -confirmationCode -isSkip');
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
  async updateProfile(data, profileId): Promise<any> {
    console.log('data = ', data);
    const profile = await this.profileModel.findById({ _id: profileId });
    if (!profile) throw new NotFoundException(' Profile does not exist');

    if (profile.role == Constants.USER && profile.status == Constants.PENDING)
      throw new HttpException(
        'Account is still not verified yet',
        HttpStatus.UNAUTHORIZED,
      );

    return this.profileModel.findByIdAndUpdate(
      { _id: profileId },
      {
        $set: {
          bio: data.bio,
          socialLinks: data.socialLinks,
          favoriteRestaurants: data.favoriteRestaurants,
          favoriteCuisines: data.favoriteCuisines,
          favoriteChefs: data.favoriteChefs,
          dietRequirements: data.dietRequirements,
          scopes: data.scopes,
          isSkip: data.isSkip,
        },
      },
      {
        returnDocument: 'after',
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
    // await this.socialPostService.removePost(oid);
    await this.resReviewService.deleteAllReviewsOfUser(oid);
    await this.socialPostService.removeUserLikes(oid);
    await this.followeeService.deleteAllFollwees(oid);
    await this.followerService.deleteAllFollowers(oid);
    // await profile.remove();
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
    const user = await this.profileModel.findOne({ email: data.email });
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
    console.log(differentPassword);
    if (!differentPassword) {
      user.password = hashedPassword;
      return user.save();
    } else
      throw new HttpException(
        'old password and new password can not be same',
        HttpStatus.NOT_ACCEPTABLE,
      );
  }

  /*** temporary route ***/
  async changeUserStatus(userId): Promise<any> {
    return this.profileModel.findOneAndUpdate(
      { _id: userId },
      { status: 'ACTIVE' },
      { returnDocument: 'after' },
    );
  }

  async filterUserByName(username): Promise<any> {
    const regex = new RegExp(username, 'i');
    return this.profileModel
      .find({ username: regex })
      .select('_id username firstname surname profileImage');
  }
}
