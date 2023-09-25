import { Module } from '@nestjs/common';
import { ReportPostController } from './report-post.controller';
import { ReportPostService } from './report-post.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReportPost,
  ReportPostSchema,
} from '../../data/schemas/report-post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ReportPost.name,
        schema: ReportPostSchema,
      },
    ]),
  ],
  controllers: [ReportPostController],
  providers: [ReportPostService],
})
export class ReportPostModule {}
