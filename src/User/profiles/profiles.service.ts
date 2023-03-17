import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../../Schemas/Profile.schema';
import mongoose, { Model } from 'mongoose';

import {
  Restaurant,
  RestaurantDocument,
} from '../../Schemas/restaurant.schema';
import { User, UserDocument } from '../../Schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Post, PostDocument } from '../../Schemas/post.schema';
import { Comment, CommentDocument } from '../../Schemas/comment.schema';
import { LikedPost, LikedPostDocument } from '../../Schemas/postLiked.schema';
import {
  RestaurantReview,
  RestaurantReviewDocument,
} from '../../Schemas/restaurantReview.schema';
import { Follower, FollowerDocument } from '../../Schemas/follower.schema';
import { Following, FollowingDocument } from '../../Schemas/following.schema';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    @InjectModel(LikedPost.name)
    private readonly likeModel: Model<LikedPostDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Following.name)
    private readonly followingModel: Model<FollowingDocument>,
    @InjectModel(Follower.name)
    private readonly followerModel: Model<FollowerDocument>,
    @InjectModel(RestaurantReview.name)
    private readonly resReviewModel: Model<FollowerDocument>,
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
    await this.postModel.findOneAndDelete({ userId: profileId });
    await this.commentModel.updateMany(
      { active: true },
      { $pull: { commentObject: { userId: oid } } },
    );
    await this.resReviewModel.updateMany(
      { active: true },
      { $pull: { reviewObject: { userId: profileId } } },
    );
    await this.likeModel.updateMany(
      { active: true },
      { $pull: { userId: oid } },
    );
    await this.followingModel.findOneAndDelete({ userId: oid });
    await this.followerModel.findOneAndDelete({ userId: oid });
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
}
