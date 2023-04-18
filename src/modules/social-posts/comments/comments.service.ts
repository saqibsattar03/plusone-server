import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Comment } from 'src/data/schemas/comment.schema';
import * as moment from 'moment';
import { CommentDto } from '../../../data/dtos/socialPost.dto';
import { SocialPostsService } from '../social-posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @Inject(forwardRef(() => SocialPostsService))
    private readonly socialPostService: SocialPostsService,
  ) {}

  async postComment(commentDto: CommentDto): Promise<Comment> {
    commentDto.commentObject._id = new mongoose.Types.ObjectId(
      commentDto.commentObject._id,
    );

    commentDto.commentObject.userId = new mongoose.Types.ObjectId(
      commentDto.commentObject.userId,
    );
    let c;
    const res = await this.commentModel.findOne({ postId: commentDto.postId });
    if (!res) {
      const r = await this.commentModel.create({ postId: commentDto.postId });
      await r.updateOne({
        $push: {
          commentObject: {
            _id: commentDto.commentObject._id,
            userId: commentDto.commentObject.userId,
            commentText: commentDto.commentObject.commentText,
            updatedAt: moment().format(),
          },
        },
      });
      c = await this.socialPostService.getCommentCount(commentDto.postId);
      c = c.commentCount + 1;
      await this.socialPostService.updateCommentCount(commentDto.postId, c);
    } else if (res) {
      await res.updateOne({
        $push: {
          commentObject: {
            _id: commentDto.commentObject._id,
            userId: commentDto.commentObject.userId,
            commentText: commentDto.commentObject.commentText,
            updatedAt: moment().format(),
          },
        },
      });
      c = await this.socialPostService.getCommentCount(commentDto.postId);
      c = c.commentCount + 1;
      await this.socialPostService.updateCommentCount(commentDto.postId, c);
    }
    throw new HttpException('comment posted successfully ', HttpStatus.OK);
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
          postId: 1,
          'users.surname': 1,
          'users.firstname': 1,
          'user.profileImage': 1,
          commentObject: 1,
        },
      },
      {
        $unset: ['_id'],
      },
    ]);
  }

  async deleteSingleComment(data): Promise<any> {
    const res = await this.commentModel.findOne({
      postId: data.postId,
    });
    if (!res)
      throw new HttpException('no such Post found', HttpStatus.NOT_FOUND);
    else if (res) {
      const oid = mongoose.Types.ObjectId.createFromHexString(data.commentId);

      const r = await this.commentModel.updateOne(
        { postId: data.postId },
        { $pull: { commentObject: { _id: oid } } },
        { safe: true },
      );
      let c = await this.socialPostService.getCommentCount(data.postId);
      c = c.commentCount - 1;
      await this.socialPostService.updateCommentCount(data.postId, c);
      return r;
    }
    throw new HttpException('no such comment found', HttpStatus.NOT_FOUND);
  }

  async deleteAllComment(postId): Promise<any> {
    return this.commentModel.findOneAndDelete(postId);
  }
}
