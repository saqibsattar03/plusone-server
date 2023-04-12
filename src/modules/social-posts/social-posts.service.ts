import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from 'src/data/schemas/post.schema';
import {
  LikedPost,
  LikedPostDocument,
} from 'src/data/schemas/postLiked.schema';
import { UpdateSocialPost } from '../../data/dtos/socialPost.dto';
import { Constants } from '../../common/constants';
import { FollowingService } from '../following/following.service';

@Injectable()
export class SocialPostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly socialPostModel: Model<PostDocument>,
    @InjectModel(LikedPost.name)
    private readonly postLikedModel: Model<LikedPostDocument>,
    private readonly followingService: FollowingService,
  ) {}

  async createPost(postDto: any): Promise<PostDocument> {
    console.log('postDto = ', postDto);
    try {
      if (postDto.postType == Constants.FEED) {
        return this.socialPostModel.create(postDto);
      } else {
        return this.socialPostModel.create({
          userId: postDto.reviewObject.userId,
          voucherId: postDto.reviewObject.voucherId,
          caption: postDto.reviewObject.reviewText,
          postType: Constants.REVIEW,
        });
      }
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async getAllPost(paginationDto, data): Promise<any> {
    const { limit, offset } = paginationDto;
    const pipeLine = await this.getPostPipeline();
    switch (data.postType) {
      case Constants.PUBLIC: {
        console.log('here');
        return this.socialPostModel
          .aggregate([
            {
              $match: {
                postAudiencePreference: 'PUBLIC',
              },
            },
            ...pipeLine,
            // {
            //   $lookup: {
            //     from: 'vouchers',
            //     localField: 'voucherId',
            //     foreignField: 'voucherObject._id',
            //     as: 'result',
            //   },
            // },
            // {
            //   $unwind: {
            //     path: '$result',
            //     preserveNullAndEmptyArrays: true,
            //   },
            // },
            // {
            //   $unwind: {
            //     path: '$result.voucherObject',
            //     preserveNullAndEmptyArrays: true,
            //   },
            // },
            // {
            //   $lookup: {
            //     from: 'profiles',
            //     localField: 'userId',
            //     foreignField: '_id',
            //     as: 'user',
            //   },
            // },
            // {
            //   $unwind: {
            //     path: '$user',
            //   },
            // },
            // {
            //   $lookup: {
            //     from: 'likedposts',
            //     localField: '_id',
            //     foreignField: 'postId',
            //     as: 'liked',
            //   },
            // },
            // {
            //   $unwind:
            //     /**
            //      * path: Path to the array field.
            //      * includeArrayIndex: Optional name for index.
            //      * preserveNullAndEmptyArrays: Optional
            //      *   toggle to unwind null and empty values.
            //      */
            //     {
            //       path: '$liked',
            //     },
            // },
            // {
            //   $unwind:
            //     /**
            //      * path: Path to the array field.
            //      * includeArrayIndex: Optional name for index.
            //      * preserveNullAndEmptyArrays: Optional
            //      *   toggle to unwind null and empty values.
            //      */
            //     {
            //       path: '$liked.userId',
            //       preserveNullAndEmptyArrays: true,
            //     },
            // },
            // {
            //   $project: {
            //     username: '$user.username',
            //     profileImage: '$user.profileImage',
            //     caption: 1,
            //     postAudiencePreference: 1,
            //     postType: 1,
            //     postLiked: {
            //       $cond: {
            //         if: {
            //           $eq: ['$userId', '$liked.userId'],
            //         },
            //         then: true,
            //         else: false,
            //       },
            //     },
            //     voucherId: 1,
            //     media: 1,
            //     likesCount: 1,
            //     commentCount: 1,
            //     voucher: '$result.voucherObject',
            //     createdAt: 1,
            //     updatedAt: 1,
            //     v: {
            //       $cond: {
            //         if: {
            //           $eq: ['$postType', 'FEED'],
            //         },
            //         then: {},
            //         else: {
            //           $cond: {
            //             if: {
            //               $eq: ['$voucherId', '$result.voucherObject._id'],
            //             },
            //             then: '$result.voucherObject',
            //             else: null,
            //           },
            //         },
            //       },
            //     },
            //   },
            // },
            // {
            //   $match: {
            //     v: {
            //       $ne: null,
            //     },
            //   },
            // },
            // {
            //   $project: {
            //     v: 0,
            //   },
            // },
          ])
          .skip(offset)
          .limit(limit);
      }
      case Constants.FOLLOWING: {
        console.log('here in following');
        try {
          const followings = await this.followingService.getFollowingIds(
            data.userId,
          );
          const followingsArray = [];
          followings.forEach((obj) => {
            followingsArray.push(obj.followings);
          });
          return this.socialPostModel
            .aggregate([
              {
                $match: {
                  postAudiencePreference: 'PUBLIC',
                },
              },
              {
                $lookup: {
                  from: 'vouchers',
                  localField: 'voucherId',
                  foreignField: 'voucherObject._id',
                  as: 'result',
                },
              },
              {
                $unwind: {
                  path: '$result',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $unwind: {
                  path: '$result.voucherObject',
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
                  from: 'likedposts',
                  localField: '_id',
                  foreignField: 'postId',
                  as: 'liked',
                },
              },
              {
                $unwind: {
                  path: '$liked',
                },
              },
              {
                $unwind: {
                  path: '$liked.userId',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  username: '$user.username',
                  profileImage: '$user.profileImage',
                  caption: 1,
                  postAudiencePreference: 1,
                  postType: 1,
                  postLiked: {
                    $cond: {
                      if: {
                        $eq: ['$userId', '$liked.userId'],
                      },
                      then: true,
                      else: false,
                    },
                  },
                  voucherId: 1,
                  media: 1,
                  likesCount: 1,
                  commentCount: 1,
                  voucher: '$result.voucherObject',
                  createdAt: 1,
                  updatedAt: 1,
                  v: {
                    $cond: {
                      if: {
                        $eq: ['$postType', 'FEED'],
                      },
                      then: {},
                      else: {
                        $cond: {
                          if: {
                            $eq: ['$voucherId', '$result.voucherObject._id'],
                          },
                          then: '$result.voucherObject',
                          else: null,
                        },
                      },
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
            ])
            .skip(offset)
            .limit(limit);
        } catch (e) {
          throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
      }
    }
  }
  async getPost(postId): Promise<PostDocument> {
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
      { returnDocument: 'after' },
    );
  }
  async removePost(userId, postId): Promise<PostDocument> {
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
    await post.deleteOne();
    throw new HttpException('post deleted successfully', HttpStatus.OK);
  }
  async likePost(userId, postId): Promise<LikedPostDocument> {
    const res = await this.postLikedModel.findOne({ postId: postId });
    if (!res) {
      const post = await this.postLikedModel.create({ postId: postId });
      await post.updateOne({ $push: { userId: userId } });
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
          .select('likesCount -_id');
        await this.socialPostModel.updateOne(
          { _id: postId },
          { likesCount: c.likesCount + 1 },
        );
      } else throw new HttpException('already liked', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('post liked successfully', HttpStatus.OK);
  }
  async removeLike(userId, postId): Promise<any> {
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
      throw new HttpException('like already removed', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('like removed', HttpStatus.OK);
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

  async getPostPipeline() {
    return [
      {
        $lookup: {
          from: 'vouchers',
          localField: 'voucherId',
          foreignField: 'voucherObject._id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$result.voucherObject',
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
          from: 'likedposts',
          localField: '_id',
          foreignField: 'postId',
          as: 'liked',
        },
      },
      {
        $unwind: {
          path: '$liked',
        },
      },
      {
        $unwind: {
          path: '$liked.userId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          username: '$user.username',
          profileImage: '$user.profileImage',
          caption: 1,
          postAudiencePreference: 1,
          postType: 1,
          postLiked: {
            $cond: {
              if: {
                $eq: ['$userId', '$liked.userId'],
              },
              then: true,
              else: false,
            },
          },
          voucherId: 1,
          media: 1,
          likesCount: 1,
          commentCount: 1,
          voucher: '$result.voucherObject',
          createdAt: 1,
          updatedAt: 1,
          v: {
            $cond: {
              if: {
                $eq: ['$postType', 'FEED'],
              },
              then: {},
              else: {
                $cond: {
                  if: {
                    $eq: ['$voucherId', '$result.voucherObject._id'],
                  },
                  then: '$result.voucherObject',
                  else: null,
                },
              },
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
    ];
  }
}
