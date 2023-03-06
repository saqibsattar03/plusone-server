import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/Schemas/comment.schema';
import { PostDocument, Post } from 'src/Schemas/post.schema';
import { LikedPost, LikedPostDocument } from 'src/Schemas/postLiked.schema';
import { CreatePostDTO } from './dto/create-post.dto';
import { PostLikedDTO } from './dto/liked-post.dto';
import { Profile, ProfileDocument } from '../Schemas/Profile.schema';

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
    const post = await this.socialPostModel
      .findById(postId)
      .populate('comments')
      .populate('likes');
    return post;
  }

  async updatePost(id, createPostDto: any): Promise<PostDocument> {
    const updatePost = await this.socialPostModel.findByIdAndUpdate(
      id,
      createPostDto,
    );
    return updatePost;
  }

  async updatePostPreference(userId, postId, preference): Promise<any> {
    const user = await this.socialPostModel.findOne({ userId: userId });
    if (!user) return 'you are not allowed to update post';
    return this.socialPostModel.findOneAndUpdate(
      { _id: postId },
      { postAudiencePreference: preference },
    );
    // if(!res) return 'wrong user. please provide correct user to update'
    // return this.socialPostModel.findOneAndUpdate({_id: postId},{postAudiencePreference: preference}).populate('userId');
  }

  async removePost(postId): Promise<PostDocument> {
    const post = await this.socialPostModel.findById(postId);
    await this.commentModel.findOneAndDelete({ postId: postId });
    await this.postLikedModel.findOneAndDelete({ postId: postId });
    // await this.commentModel.deleteMany({_id:{$in: post.comments}})
    await post.remove();
    return post;
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
      } else {
        console.log('already liked');
      }
    }
    return res;
  }
  async removeLike(userId, postId): Promise<any> {
    const res = await this.postLikedModel.findOne({ postId: postId });
    if (!res) return 'no such like found';
    if (res) {
      if (res.userId.includes(userId)) {
        console.log('count in dislike condition = ', this.likesCount);
        this.likesCount--;
        console.log('count after disliking = ', this.likesCount);
        await res.updateOne({ $pull: { userId: userId } });
        await this.socialPostModel.updateOne({
          $set: { likesCount: this.likesCount },
        });
      } else {
        return 'like already removed';
      }
    }
    return res;
  }
}
