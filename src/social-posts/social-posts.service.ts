/* eslint-disable prettier/prettier */
import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/Schemas/comment.schema';
import { PostDocument , Post} from 'src/Schemas/post.schema';
import { LikedPost, LikedPostDocument } from 'src/Schemas/postLiked.schema';
import { CreatePostDTO } from './dto/create-post.dto';
import { PostLikedDTO } from './dto/liked-post.dto';

@Injectable()
export class SocialPostsService {
  constructor(
    @InjectModel(Post.name) private readonly socialPostModel: Model<PostDocument>,
    @InjectModel(LikedPost.name) private readonly postLikedModel: Model<LikedPostDocument>,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>
    ){}

    // Create Post
    async createPost(createPostDto: CreatePostDTO): Promise<PostDocument>
    {
        const post = await new this.socialPostModel(createPostDto) 
        return post.save();
    }

    async getPost(postId): Promise<PostDocument>{
        const post = await this.socialPostModel.findById(postId).populate("comments").populate("likes")
        return post
    }

    async updatePost(id, createPostDto:any): Promise<PostDocument>{
        const updatePost = await this.socialPostModel.findByIdAndUpdate(id, createPostDto)
        return updatePost
    }

    async removePost(postId): Promise<PostDocument>{
        const deletedPost = await this.socialPostModel.findByIdAndDelete(postId)
        await this.commentModel.deleteMany({_id:{$in: deletedPost.comments}})
        return deletedPost
    }

    async likePost(userId,postLikedDto: PostLikedDTO):Promise<LikedPostDocument>
    {
        const post = await this.socialPostModel.findById(postLikedDto.postId)
        if(!post)
        {
        await post.updateOne({$push:{likes: userId}})
        }
        else{
            console.log("already liked")
        }
        return;
    }
    async removeLike(userId, postLikedDto: PostLikedDTO): Promise<LikedPostDocument>
    {
        const post = await this.socialPostModel.findById(postLikedDto.postId)
        await post.updateOne({$pull:{likes:  userId}})
        return
    }

}
