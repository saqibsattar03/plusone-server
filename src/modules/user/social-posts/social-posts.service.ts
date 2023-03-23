import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument, Post } from 'src/data/schemas/post.schema';
import {
  LikedPost,
  LikedPostDocument,
} from 'src/data/schemas/postLiked.schema';
import {
  SocialPostDto,
  UpdateSocialPost,
} from '../../../data/dtos/socialPost.dto';

@Injectable()
export class SocialPostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly socialPostModel: Model<PostDocument>,
    @InjectModel(LikedPost.name)
    private readonly postLikedModel: Model<LikedPostDocument>,
  ) {}

  async createPost(createPostDto: SocialPostDto): Promise<PostDocument> {
    return this.socialPostModel.create(createPostDto);
  }

  async getPost(postId): Promise<PostDocument> {
    return this.socialPostModel.findById(postId);
    // .populate('comments')
    // .populate('likes');
  }

  async updatePost(
    postId,
    updatePostDto: UpdateSocialPost,
  ): Promise<PostDocument> {
    // const user = await this.socialPostModel.findOne({
    //   _id: postId,
    //   userId: userId,
    // });
    // if (!user)
    //   throw new HttpException(
    //     'not allow to edit post',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    return this.socialPostModel.findByIdAndUpdate(postId, updatePostDto);
  }

  async updatePostPreference(postId, preference): Promise<any> {
    return this.socialPostModel.findOneAndUpdate(
      { _id: postId },
      { postAudiencePreference: preference },
    );
  }

  async removePost(postId): Promise<PostDocument> {
    const post = await this.socialPostModel.findById(postId);
    await this.postLikedModel.findOneAndDelete({ postId: postId });
    await post.remove();
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
      // await this.socialPostModel.updateOne({
      //   $set: { likesCount: this.likesCount },
      // });
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
}
