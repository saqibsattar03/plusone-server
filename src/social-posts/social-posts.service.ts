import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/Schemas/comment.schema';
import { PostDocument, Post } from 'src/Schemas/post.schema';
import { LikedPost, LikedPostDocument } from 'src/Schemas/postLiked.schema';
import { CreatePostDTO } from './dto/create-post.dto';
import { Profile, ProfileDocument } from '../Schemas/Profile.schema';
import { UpdatePostDTO } from './dto/update-post.dto';

@Injectable()
export class SocialPostsService {
  private likesCount = 0;
  constructor(
    @InjectModel(Post.name)
    private readonly socialPostModel: Model<PostDocument>,
    @InjectModel(LikedPost.name)
    private readonly postLikedModel: Model<LikedPostDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async createPost(createPostDto: CreatePostDTO): Promise<PostDocument> {
    this.likesCount = 0;
    const post = await new this.socialPostModel(createPostDto);
    return post.save();
  }

  async getPost(postId): Promise<PostDocument> {
    return this.socialPostModel.findById(postId);
    // .populate('comments')
    // .populate('likes');
  }

  async updatePost(
    postId,
    userId,
    updatePostDto: UpdatePostDTO,
  ): Promise<PostDocument> {
    const user = await this.socialPostModel.findOne({
      _id: postId,
      userId: userId,
    });
    if (!user)
      throw new HttpException(
        'not allow to edit post',
        HttpStatus.UNAUTHORIZED,
      );
    return this.socialPostModel.findByIdAndUpdate(postId, updatePostDto);
  }

  async updatePostPreference(userId, postId, preference): Promise<any> {
    const user = await this.socialPostModel.findOne({
      _id: postId,
      userId: userId,
    });
    if (!user)
      throw new HttpException(
        'not allow to edit post',
        HttpStatus.UNAUTHORIZED,
      );
    return this.socialPostModel.findOneAndUpdate(
      { _id: postId },
      { postAudiencePreference: preference },
    );
  }

  async removePost(postId): Promise<PostDocument> {
    const post = await this.socialPostModel.findById(postId);
    await this.commentModel.findOneAndDelete({ postId: postId });
    await this.postLikedModel.findOneAndDelete({ postId: postId });
    await post.remove();
    throw new HttpException('post deleted successfully', HttpStatus.OK);
  }

  async likePost(userId, postId): Promise<LikedPostDocument> {
    const res = await this.postLikedModel.findOne({ postId: postId });
    if (!res) {
      this.likesCount++;
      const post = await this.postLikedModel.create({ postId: postId });
      await post.updateOne({ $push: { userId: userId } });
      await this.socialPostModel.updateOne({
        $set: { likesCount: this.likesCount },
      });
    } else if (res) {
      if (!res.userId.includes(userId)) {
        this.likesCount++;
        await res.updateOne({ $push: { userId: userId } });
        await this.socialPostModel.updateOne({
          $set: { likesCount: this.likesCount },
        });
      } else throw new HttpException('already liked', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('post liked successfully', HttpStatus.OK);
  }
  async removeLike(userId, postId): Promise<any> {
    const res = await this.postLikedModel.findOne({ postId: postId });
    if (!res) throw new HttpException('no post found', HttpStatus.NOT_FOUND);
    if (res) {
      if (res.userId.includes(userId)) {
        this.likesCount--;
        await res.updateOne({ $pull: { userId: userId } });
        await this.socialPostModel.updateOne({
          $set: { likesCount: this.likesCount },
        });
      }
      throw new HttpException('like already removed', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('like removed', HttpStatus.OK);
  }
}
