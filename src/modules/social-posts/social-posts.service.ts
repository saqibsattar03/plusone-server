import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post, PostDocument } from 'src/data/schemas/post.schema';
import {
  LikedPost,
  LikedPostDocument,
} from 'src/data/schemas/postLiked.schema';
import { UpdateSocialPost } from '../../data/dtos/socialPost.dto';
import { Constants } from '../../common/constants';
import { FollowingService } from '../following/following.service';
import { CommentsService } from './comments/comments.service';
import { FcmService } from '../fcm/fcm.service';
import { ProfilesService } from '../profiles/profiles.service';
@Injectable()
export class SocialPostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly socialPostModel: Model<PostDocument>,
    @InjectModel(LikedPost.name)
    private readonly postLikedModel: Model<LikedPostDocument>,
    private readonly followingService: FollowingService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentService: CommentsService,
    @Inject(forwardRef(() => FcmService))
    protected readonly fcmService: FcmService,
    @Inject(forwardRef(() => ProfilesService))
    protected readonly profileService: ProfilesService,
  ) {}
  async createPost(postDto: any): Promise<PostDocument> {
    try {
      const userType = await this.profileService.getUserFields(postDto.userId);
      if (postDto.postType == Constants.FEED) {
        postDto.voucherId = null;
        postDto.postToShow = userType.accountHolderType;
        return this.socialPostModel.create(postDto);
      } else {
        return this.socialPostModel.create({
          userId: postDto.reviewObject.userId,
          voucherId: postDto.reviewObject.voucherId,
          caption: postDto.reviewObject.reviewText,
          accountHolderType: userType.accountHolderType,
          postType: Constants.REVIEW,
        });
      }
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async getAllPost(paginationDto, data): Promise<any> {
    const { limit, offset } = paginationDto;
    const pipeLine = await this.getPostPipeline(data.loggedInUser);
    const followings = await this.followingService.getFollowingIds(
      data.loggedInUser,
    );
    const followingsArray = [];
    followings.forEach((obj) => {
      followingsArray.push(obj.followings);
    });
    const r = followingsArray.flat();
    const query = [];

    if (data.caption) {
      query.push({
        $match: {
          caption: {
            $regex: data.caption.toString(),
            $options: 'i', // case-insensitive search
          },
        },
      });
    }
    if (data.longitude && data.latitude && !data.caption) {
      query.push({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [
              parseFloat(data.longitude),
              parseFloat(data.latitude),
            ],
          },
          distanceField: 'distanceFromMe',
          /*** distance in miles ***/
          distanceMultiplier: 0.000621371,

          /*** maxdistance would set the range of 5 miles, 1609.34 = 1 mile ***/
          maxDistance: 1609.34 * 5,
          spherical: true,
        },
      });
    }
    switch (data.postAudiencePreference) {
      case Constants.PUBLIC: {
        try {
          const match = {
            $match: {
              postAudiencePreference: Constants.PUBLIC,
            },
          };
          query.push(match);
          const p = [
            ...query,
            ...pipeLine,
            { $skip: offset },
            { $limit: limit },
          ];
          return this.socialPostModel.aggregate(p);
        } catch (e) {
          throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
      }
      case Constants.FOLLOWING: {
        try {
          const match = {
            $match: {
              userId: {
                $in: r,
              },
            },
          };
          query.push(match);
          const match1 = {
            $match: {
              postAudiencePreference: {
                $ne: Constants.ONLYME,
              },
            },
          };
          query.push(match1);
          const p = [
            ...query,
            ...pipeLine,
            { $skip: offset },
            { $limit: limit },
          ];
          return this.socialPostModel.aggregate(p);
        } catch (e) {
          throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
      }
      case Constants.MYPOSTS: {
        try {
          return this.socialPostModel.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(data.userId),
              },
            },
            ...pipeLine,
          ]);
        } catch (e) {
          throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
      }
    }
  }

  async getSinglePost(postId): Promise<PostDocument> {
    return this.socialPostModel.findById(postId);
  }

  async updatePost(
    userId,
    updatePostDto: UpdateSocialPost,
  ): Promise<PostDocument> {
    const user = await this.socialPostModel.findOne({
      _id: updatePostDto.postId,
      userId: userId,
    });
    if (!user)
      throw new HttpException(
        'not allow to edit post',
        HttpStatus.UNAUTHORIZED,
      );
    return this.socialPostModel.findByIdAndUpdate(
      updatePostDto.postId,
      updatePostDto,
      { new: true },
    );
  }

  async deleteSinglePost(userId, postId): Promise<PostDocument> {
    const post = await this.socialPostModel.findOne({
      _id: postId,
      userId: userId,
    });
    if (!post)
      throw new HttpException(
        'unAuthorize to delete this post',
        HttpStatus.UNAUTHORIZED,
      );
    await this.postLikedModel.findOneAndDelete({ postId: postId });
    await this.commentService.deleteAllComment(postId);
    await post.deleteOne();
    throw new HttpException('post deleted successfully', HttpStatus.OK);
  }

  async deleteAllPostsOfSingleUser(userId): Promise<any> {
    await this.socialPostModel.deleteMany({ userId: userId });
  }

  async likePost(userId, postId): Promise<LikedPostDocument> {
    let res = await this.postLikedModel.findOne({ postId: postId });
    if (!res) {
      res = await this.postLikedModel.create({ postId: postId });
      await res.updateOne({ $push: { userId: userId } });
      const c = await this.socialPostModel
        .findOne({ _id: postId })
        .select('likesCount -_id');
      await this.socialPostModel.updateOne(
        { _id: postId },
        { likesCount: c.likesCount + 1 },
      );
    } else if (res) {
      if (!res.userId.includes(userId)) {
        await res.updateOne({ $push: { userId: userId } });
        const c = await this.socialPostModel
          .findOne({ _id: postId })
          .select('likesCount userId -_id');
        await this.socialPostModel.updateOne(
          { _id: postId },
          { likesCount: c.likesCount + 1 },
        );
      }
    }
    //*** send like post notification ***//

    const postedUser = await this.getPostUserId(res.postId);
    const userData = await this.profileService.getUserFields(userId);
    const notification = {
      email: postedUser.email,
      title: 'New Like! 👍',
      body: `Your post just got a like from ${userData.firstname} ${userData.surname}! 👍`,
      profileImage: userData.profileImage,
    };
    //*** like post notification ***//
    if (postedUser._id.toString() != userData._id.toString())
      await this.fcmService.sendSingleNotification(notification);
    throw new HttpException('post liked successfully', HttpStatus.OK);
  }

  async removeLike(userId, postId): Promise<any> {
    console.log('like remove function');
    const res = await this.postLikedModel.findOne({ postId: postId });
    if (!res) throw new HttpException('no post found', HttpStatus.NOT_FOUND);
    if (res) {
      if (res.userId.includes(userId)) {
        await res.updateOne({ $pull: { userId: userId } });
        const c = await this.socialPostModel
          .findOne({ _id: postId })
          .select('likesCount -_id');
        await this.socialPostModel.updateOne(
          { _id: postId },
          { likesCount: c.likesCount - 1 },
        );
      }
      throw new HttpException('like removed successfully', HttpStatus.OK);
    }
    throw new HttpException('like already removed', HttpStatus.BAD_REQUEST);
  }

  async removeUserLikes(userId): Promise<any> {
    await this.postLikedModel.updateMany(
      { active: true },
      { $pull: { userId: userId } },
    );
  }

  async getCommentCount(postId): Promise<any> {
    return this.socialPostModel
      .findOne({ _id: postId })
      .select('commentCount -_id');
  }

  async updateCommentCount(postId, count): Promise<any> {
    return this.socialPostModel.findOneAndUpdate(
      { _id: postId },
      { commentCount: count },
    );
  }

  async filterPostBasedOnCaption(keyword: string): Promise<any> {
    return this.socialPostModel.find({ $text: { $search: keyword } });
  }

  async getPostPipeline(userId) {
    const userType = await this.profileService.getUserFields(userId);
    return [
      // checking if post is for student or non-student user //
      {
        $match: {
          postToShow: userType.accountHolderType,
        },
      },
      {
        $lookup: {
          from: 'vouchers',
          localField: 'voucherId',
          foreignField: 'voucherObject._id',
          as: 'voucher',
        },
      },
      {
        $unwind: {
          path: '$voucher',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$voucher.voucherObject',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $lookup: {
          from: 'followings',
          let: {
            uId: new mongoose.Types.ObjectId(userId),
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
      {
        $unwind: {
          path: '$followed',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'followrequests',
          let: {
            // uId: ObjectId('644a4c7d1913f5e2b20fd596'),
            rTo: '$userId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$requestedTo', '$$rTo'],
                },
              },
            },
          ],
          as: 'requested',
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          user: 1,
          location: 1,
          caption: 1,
          postToShow: 1,
          postAudiencePreference: 1,
          postType: 1,
          voucherId: 1,
          voucher: 1,
          media: 1,
          likesCount: 1,
          commentCount: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,

          followed: {
            $cond: {
              if: {
                $not: '$followed',
              },
              then: [],
              else: '$followed',
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
        $lookup: {
          from: 'likedposts',
          localField: '_id',
          foreignField: 'postId',
          as: 'liked',
        },
      },
      {
        $unwind: {
          path: '$liked',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          location: 1,
          caption: 1,
          postToShow: 1,
          postAudiencePreference: 1,
          postType: 1,
          voucherId: 1,
          voucher: 1,
          media: 1,
          likesCount: 1,
          commentCount: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
          user: 1,
          followed: 1,
          requested: 1,
          liked: {
            $cond: {
              if: {
                $not: '$liked',
              },
              then: [],
              else: '$liked',
            },
          },
        },
      },
      {
        $project: {
          username: '$user.username',
          firstname: '$user.firstname',
          surname: '$user.surname',
          userId: '$userId',
          profileImage: '$user.profileImage',
          caption: 1,
          location: 1,
          postToShow: 1,
          postAudiencePreference: 1,
          postType: 1,
          postLiked: {
            $cond: {
              if: {
                $in: [new mongoose.Types.ObjectId(userId), '$liked.userId'],
              },
              then: true,
              else: false,
            },
          },
          userFollowed: {
            $cond: {
              if: {
                $in: ['$userId', '$followed.followings'],
              },
              then: true,
              else: false,
            },
          },
          isRequested: {
            $cond: {
              if: {
                $eq: ['$requested', null],
              },
              then: false,
              else: true,
            },
          },
          voucherId: 1,
          media: 1,
          likesCount: 1,
          commentCount: 1,
          voucher: {
            restaurantId: '$voucher.restaurantId',
            _id: '$voucher.voucherObject._id',
            title: '$voucher.voucherObject.title',
            voucherType: '$voucher.voucherObject.voucherType',
            voucherPreference: '$voucher.voucherObject.voucherPreference',
            discount: '$voucher.voucherObject.discount',
            description: '$voucher.voucherObject.description',
            voucherImage: '$voucher.voucherObject.voucherImage',
            estimatedSavings: '$voucher.voucherObject.estimatedSavings',
          },
          createdAt: 1,
          updatedAt: 1,
          v: {
            $cond: {
              if: {
                $or: [
                  {
                    $eq: ['$postType', 'FEED'],
                  },
                  {
                    $eq: ['$postType', 'REVIEW'],
                  },
                ],
              },
              then: {},
              else: null,
            },
          },
        },
      },
      {
        $match: {
          v: {
            $ne: null,
          },
        },
      },
      {
        $project: {
          v: 0,
        },
      },
      {
        $unset: [
          'voucher.studentVoucherCount',
          'voucher.nonStudentVoucherCount',
        ],
      },
      {
        $group: {
          _id: '$_id',
          doc: {
            $first: '$$ROOT',
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: '$doc',
        },
      },
    ];
  }

  async searchPostByLocation(data): Promise<PostDocument[]> {
    if (!data.longitude && !data.latitude)
      throw new HttpException('no location selected', HttpStatus.BAD_REQUEST);
    return this.socialPostModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [
              parseFloat(data.longitude),
              parseFloat(data.latitude),
            ],
          },
          distanceField: 'distanceFromMe',
          distanceMultiplier: 0.001,
          spherical: true,
        },
      },
    ]);
  }

  async getPostUserId(postId): Promise<any> {
    const postedUserId = await this.socialPostModel
      .findOne({
        _id: postId,
      })
      .select('userId -_id');

    return this.profileService.getUserFields(postedUserId.userId);
  }
}
