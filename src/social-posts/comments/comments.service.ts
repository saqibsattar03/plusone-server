import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Comment } from 'src/Schemas/comment.schema';
import { Post, PostDocument } from 'src/Schemas/post.schema';
import { CreateCommentDTO } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  private commentCount = 0;
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Post.name)
    private readonly socialPostModel: Model<PostDocument>,
  ) {}

  async postComment(
    createCommentDto: CreateCommentDTO,
    postId,
  ): Promise<Comment> {
    createCommentDto.commentObject._id = new mongoose.Types.ObjectId(
      createCommentDto.commentObject._id,
    );
    const res = await this.commentModel.findOne({ postId: postId });
    if (!res) {
      const r = await this.commentModel.create({ postId: postId });
      await r.updateOne({
        $push: {
          commentObject: {
            _id: createCommentDto.commentObject._id,
            userId: createCommentDto.commentObject.userId,
            commentText: createCommentDto.commentObject.commentText,
          },
        },
      });
      this.commentCount++;
      await this.socialPostModel.updateOne({
        $set: { commentCount: this.commentCount },
      });
    } else if (res) {
      await res.updateOne({
        $push: {
          commentObject: {
            _id: createCommentDto.commentObject._id,
            userId: createCommentDto.commentObject.userId,
            commentText: createCommentDto.commentObject.commentText,
          },
        },
      });
      this.commentCount++;
      await this.socialPostModel.updateOne({
        $set: { commentCount: this.commentCount },
      });
    }
    return res;
  }

  async editComment(postId, data): Promise<any> {
    const res = await this.commentModel.findOne({
      postId: postId,
    });
    if (!res) return 'no such post found';
    else if (res) {
      const oid = mongoose.Types.ObjectId.createFromHexString(data._id);
      const r = await this.commentModel.findOneAndUpdate(
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
      return r;
    } else return 'no such comment found';
  }

  async deleteComment(commentId, postId): Promise<any> {
    const res = await this.commentModel.findOne({
      postId: postId,
    });
    if (!res) return 'no such Post found';
    else if (res) {
      const oid = mongoose.Types.ObjectId.createFromHexString(commentId);

      const r = await this.commentModel.updateOne(
        { postId: postId },
        { $pull: { commentObject: { _id: oid } } },
        { safe: true },
      );
      this.commentCount--;
      await this.socialPostModel.updateOne({
        $set: { commentCount: this.commentCount },
      });
      return r;
    } else return 'no such comment found';
  }
}
