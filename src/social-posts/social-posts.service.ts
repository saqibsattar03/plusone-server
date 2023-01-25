/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IComment } from 'src/comments/interface/comment.interface';
import { CreatePostDTO } from './dto/create-post.dto';
import { PostLikedDTO } from './dto/liked-post.dto';
import { IPost } from './interface/post.interface';
import { IPostLiked } from './interface/postLiked.interface';

@Injectable()
export class SocialPostsService {
  constructor(
    @InjectModel('Post') private readonly socialPostModel: Model<IPost>,
    @InjectModel('PostLiked') private readonly postLikedModel: Model<IPostLiked>,
    @InjectModel('Comment') private readonly commentModel: Model<IComment>
    ){}

    // Create Post
    async createPost(createPostDto: CreatePostDTO): Promise<IPost>
    {
        const post = await new this.socialPostModel(createPostDto) 
        return post.save();
    }

    async getPost(postId): Promise<IPost>{
        const post = await this.socialPostModel.findById(postId).populate("comments")
        return post
    }

    async updatePost(id, createPostDto:any): Promise<IPost>{
        const updatePost = await this.socialPostModel.findByIdAndUpdate(id, createPostDto)
        return updatePost
    }

    async removePost(postId): Promise<IPost>{
        const deletedPost = await this.socialPostModel.findByIdAndDelete(postId)
        await this.commentModel.deleteMany({_id:{$in: deletedPost.comments}})
        return deletedPost
    }

    async likePost(postLikedDto: PostLikedDTO):Promise<IPostLiked>
    {
        const postLiked = await new this.postLikedModel(postLikedDto)
        return postLiked.save()
    }
    async unlikePost(userId, postId): Promise<IPostLiked>
    {
        //const unlikedPost = await this.postLikedModel.findByIdAndDelete({_id:userId})
        const unlikedPost = await this.postLikedModel.findById({userId:userId})
        return unlikedPost;
    }

}
