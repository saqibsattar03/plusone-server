import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReportPost,
  ReportPostDocument,
} from '../../data/schemas/report-post.schema';
import mongoose, { Model } from 'mongoose';
import { ReportPostDto } from '../../data/dtos/report-post.dto';

@Injectable()
export class ReportPostService {
  constructor(
    @InjectModel(ReportPost.name)
    private readonly reportPostModel: Model<ReportPostDocument>,
  ) {}

  async reportPost(reportPostDto: ReportPostDto): Promise<ReportPostDocument> {
    return this.reportPostModel.create({
      userId: new mongoose.Types.ObjectId(reportPostDto.userId),
      postId: new mongoose.Types.ObjectId(reportPostDto.postId),
      reportReason: reportPostDto.reportReason,
    });
  }

  async getSinglePostReportCount(postId: string): Promise<any> {
    const res = await this.reportPostModel
      .find({
        postId: new mongoose.Types.ObjectId(postId),
      })
      .populate('postId');
    const count = res.length;
    return { post: res[0], totalReports: count };
  }
}
