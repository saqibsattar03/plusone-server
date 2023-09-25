import { Controller, Param, UseGuards } from '@nestjs/common';
import { ReportPostService } from './report-post.service';
import { Body, Get, Post, Request } from '@nestjs/common/decorators';
import { ReportPostDto } from '../../data/dtos/report-post.dto';
import { ApiBadRequestResponse, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';

@Controller('report-post')
export class ReportPostController {
  constructor(private readonly reportPostService: ReportPostService) {}

  @Post()
  @ApiBody({ type: ReportPostDto })
  @UseGuards(JwtAuthGuard)
  reportPost(@Body() data, @Request() request) {
    data.userId = request.user.userId;
    return this.reportPostService.reportPost(data);
  }

  @Get('/:postId')
  getSinglePostReportCount(@Param('postId') postId) {
    return this.reportPostService.getSinglePostReportCount(postId);
  }
}
