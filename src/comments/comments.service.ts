import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPost } from 'src/social-posts/interface/post.interface';
import { CreateCommentDTO } from './dto/comment.dto';
import { IComment } from './interface/comment.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<IComment>,
    @InjectModel('Post') private readonly socialPostModel: Model<IPost>,
  ) {}

  async postComment(
    createCommentDto: CreateCommentDTO,
    postId,
  ): Promise<IComment> {
    const post = await this.socialPostModel.findById(postId);
    const comment = await new this.commentModel(createCommentDto);
    comment.save();
    await post.updateOne({ $push: { comments: comment } });
    // post.update({
    //   $push: { comments: comment._id },
    // });
    return;
  }
  async editComment(id, createCommentDto: CreateCommentDTO): Promise<IComment> {
    const updatedComment = await this.commentModel.findByIdAndUpdate(
      id,
      createCommentDto,
    );
    return updatedComment;
  }

  async deleteComment(id): Promise<IComment> {
    const deletedComment = await this.commentModel.findByIdAndDelete(id);
    return deletedComment;
  }
}
