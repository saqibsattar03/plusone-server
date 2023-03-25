import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Comment } from 'src/data/schemas/comment.schema';
import { Post, PostDocument } from 'src/data/schemas/post.schema';
import * as moment from 'moment';
import { CommentDto } from '../../../data/dtos/socialPost.dto';
import { SocialPostsService } from '../social-posts.service';

@Injectable()
export class CommentsService {
  private commentCount = 0;
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly socialPostService: SocialPostsService,
  ) {}

  async postComment(createCommentDto: CommentDto, postId): Promise<Comment> {
    createCommentDto.commentObject._id = new mongoose.Types.ObjectId(
      createCommentDto.commentObject._id,
    );

    createCommentDto.commentObject.userId = new mongoose.Types.ObjectId(
      createCommentDto.commentObject.userId,
    );
    let c;
    const res = await this.commentModel.findOne({ postId: postId });
    if (!res) {
      const r = await this.commentModel.create({ postId: postId });
      await r.updateOne({
        $push: {
          commentObject: {
            _id: createCommentDto.commentObject._id,
            userId: createCommentDto.commentObject.userId,
            commentText: createCommentDto.commentObject.commentText,
            updatedAt: moment().format(),
          },
        },
      });
      c = await this.socialPostService.getCommentCount(postId);
      c = c.commentCount + 1;
      console.log('commentCount = ', c.commentCount);
      await this.socialPostService.updateCommentCount(postId, c);
      // await this.socialPostModel.updateOne({
      //   $set: { commentCount: this.commentCount },
      // });
    } else if (res) {
      await res.updateOne({
        $push: {
          commentObject: {
            _id: createCommentDto.commentObject._id,
            userId: createCommentDto.commentObject.userId,
            commentText: createCommentDto.commentObject.commentText,
            updatedAt: moment().format(),
          },
        },
      });
      c = await this.socialPostService.getCommentCount(postId);
      c = c.commentCount + 1;
      await this.socialPostService.updateCommentCount(postId, c);
    }
    throw new HttpException('comment created ', HttpStatus.OK);
  }

  async editComment(postId, data): Promise<any> {
    const res = await this.commentModel.findOne({
      postId: postId,
    });
    if (!res)
      throw new HttpException('no such Post found', HttpStatus.NOT_FOUND);
    else if (res) {
      const oid = mongoose.Types.ObjectId.createFromHexString(data._id);
      return this.commentModel.findOneAndUpdate(
        {
          postId: postId,
          'commentObject._id': oid,
        },
        { $set: { 'commentObject.$[element].commentText': data.commentText } },
        {
          arrayFilters: [
            {
              'element._id': oid,
            },
          ],
        },
      );
    }
    throw new HttpException('no such comment found', HttpStatus.NOT_FOUND);
  }

  async getPostComment(postId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(postId);
    return this.commentModel.aggregate([
      {
        $match: { postId: oid },
      },
      {
        $unwind: '$commentObject',
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'commentObject.userId',
          foreignField: '_id',
          as: 'users',
        },
      },
      {
        $project: {
          'users.firstName': 1,
          'users.surName': 1,
          'user.profileImage': 1,
          'commentObject.commentText': 1,
          'commentObject.updatedAt': 1,
        },
      },
    ]);
  }

  async deleteComment(commentId, postId): Promise<any> {
    const res = await this.commentModel.findOne({
      postId: postId,
    });
    if (!res)
      throw new HttpException('no such Post found', HttpStatus.NOT_FOUND);
    else if (res) {
      const oid = mongoose.Types.ObjectId.createFromHexString(commentId);

      const r = await this.commentModel.updateOne(
        { postId: postId },
        { $pull: { commentObject: { _id: oid } } },
        { safe: true },
      );
      let c = await this.socialPostService.getCommentCount(postId);
      c = c.commentCount - 1;
      await this.socialPostService.updateCommentCount(postId, c);
      return r;
    }
    throw new HttpException('no such comment found', HttpStatus.NOT_FOUND);
  }
}
