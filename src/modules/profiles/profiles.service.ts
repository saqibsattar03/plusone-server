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
import { ProfileDto, UpdateProfileDto } from '../../data/dtos/profile.dto';
import { FollowingService } from '../following/following.service';
import { FollowerService } from '../follower/follower.service';
import { SocialPostsService } from '../social-posts/social-posts.service';
import { RestaurantReviewService } from '../restaurant-review/restaurant-review.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import * as bcrypt from 'bcrypt';

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

  async createUser(createUserDto: ProfileDto) {
    if (createUserDto.role == 'ADMIN' || createUserDto.role == 'MERCHANT')
      createUserDto.accountHolderType = null;
    const userName = await this.profileModel.findOne({
      username: createUserDto.username,
    });
    if (userName)
      throw new HttpException(
        'Username already taken',
        HttpStatus.UNAUTHORIZED,
      );
    const user = await this.profileModel.findOne({
      email: createUserDto.email,
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
      firstname: createUserDto.firstname,
      surname: createUserDto.surname,
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
      accountHolderType: createUserDto.accountHolderType,
      role: createUserDto.role,
      confirmationCode: token,
    });
    await newUser.save();
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
      await verified.updateOne({ status: 'ACTIVE' });
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

  async fetchProfileUsingToken(email): Promise<any> {
    const fetchedUser = await this.profileModel
      .findOne({
        $or: [{ email: email }, { username: email }],
      })
      .select(['-password', '-confirmationCode', '-createdAt', '-updatedAt']);
    if (!fetchedUser)
      throw new HttpException(
        'no user with entered username or email found',
        HttpStatus.NOT_FOUND,
      );
    return fetchedUser;
  }
  async updateProfile(data: UpdateProfileDto, profileId): Promise<any> {
    const profile = await this.profileModel.findById({ _id: profileId });
    if (!profile) throw new NotFoundException(' Profile does not exist');

    if (profile.status == 'PENDING')
      throw new HttpException(
        'Account is still not verified yet',
        HttpStatus.UNAUTHORIZED,
      );

    return this.profileModel.findByIdAndUpdate(profileId, data, {
      returnDocument: 'after',
    });
  }

  async getAllUsers(role: string): Promise<any> {
    return this.profileModel.find({ role });
  }
  async removeProfile(profileId): Promise<ProfileDocument> {
    const oid = new mongoose.Types.ObjectId(profileId);
    const profile = await this.profileModel.findById(profileId);
    if (!profile) throw new NotFoundException(' Profile does not exist');
    await this.socialPostService.removePost(oid);
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

  async restaurantFilters(
    cuisine,
    tags,
    nearest,
    longitude,
    latitude,
  ): Promise<any> {
    return this.restaurantService.restaurantFilters(
      cuisine,
      tags,
      nearest,
      longitude,
      latitude,
    );
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
      .select('password');
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

  async changePassword(email: string, oldPassword, newPassword): Promise<any> {
    const user = await this.profileModel.findOne({ email: email });
    if (!user) throw new HttpException('use not found', HttpStatus.NOT_FOUND);
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword)
      throw new HttpException(
        'Old Password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const differentPassword = await bcrypt.compare(oldPassword, hashedPassword);
    if (!differentPassword) {
      user.password = hashedPassword;
      return user.save();
    } else
      throw new HttpException(
        'old password and new password can not be same',
        HttpStatus.NOT_ACCEPTABLE,
      );
  }
}
