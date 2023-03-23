import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../../../data/schemas/Profile.schema';
import mongoose, { Model } from 'mongoose';
import { PaginationDto } from '../../../common/auth/dto/pagination.dto';
import { UpdateProfileDto } from '../../../data/dtos/profile.dto';
import { FollowingService } from '../following/following.service';
import { FollowerService } from '../follower/follower.service';
import { SocialPostsService } from '../social-posts/social-posts.service';
import { RestaurantReviewService } from '../restaurant-review/restaurant-review.service';
import { RestaurantService } from '../../Admin/restaurant/restaurant/restaurant.service';

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
  async getSingleProfile(userId): Promise<ProfileDocument> {
    return this.profileModel.findById({ _id: userId });
  }

  async getUserByEmailOrUserName(user): Promise<ProfileDocument> {
    return this.profileModel.findOne({
      $or: [{ email: user.email }, { userName: user.email }],
    });
  }

  async fetchProfileUsingToken(email): Promise<any> {
    const fetchedUser = await this.profileModel
      .findOne({
        $or: [{ email: email }, { userName: email }],
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
    data: UpdateProfileDto,
    profileId,
  ): Promise<ProfileDocument> {
    const profile = await this.profileModel.findById({ _id: profileId });
    if (!profile) throw new NotFoundException(' Profile does not exist');

    return this.profileModel.findByIdAndUpdate(profileId, data);
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

  async getNearByRestaurants(
    cuisine,
    tags,
    nearest,
    longitude,
    latitude,
  ): Promise<any> {
    return this.restaurantService.nearByCuisineFilter(
      cuisine,
      tags,
      nearest,
      longitude,
      latitude,
    );
  }
}
