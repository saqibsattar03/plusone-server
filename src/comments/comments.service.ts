import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from 'src/Schemas/comment.schema';
import { Post, PostDocument } from 'src/Schemas/post.schema';
import { CreateCommentDTO } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Post.name)
    private readonly socialPostModel: Model<PostDocument>,
  ) {}

  async postComment(
    createCommentDto: CreateCommentDTO,
    postId,
  ): Promise<Comment> {
    const post = await this.socialPostModel.findById(postId);
    const comment = await new this.commentModel(createCommentDto);
    comment.save();
    await post.updateOne({ $push: { comments: comment } });
    return;
  }

  async editComment(id, createCommentDto: CreateCommentDTO): Promise<Comment> {
    const updatedComment = await this.commentModel.findByIdAndUpdate(
      id,
      createCommentDto,
    );
    return updatedComment;
  }

  async deleteComment(commentId, postId): Promise<Comment> {
    await this.socialPostModel.findByIdAndUpdate(
      { _id: postId },
      { $pull: { comments: commentId } },
    );
    await this.commentModel.findByIdAndDelete(commentId);
    return;
  }
}
