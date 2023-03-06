import { Controller, Delete, Patch, Query, UploadedFile } from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';
import { Body, Get, Post, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidation } from '../common/image.config';

@Controller('customer-service')
export class CustomerServiceController {
  constructor(private readonly customerService: CustomerServiceService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('media', imageValidation))
  createCustomerQuery(@Body() data, @UploadedFile() media) {
    const filename = media.originalname.trim();
    const filePath = media.path;
    const fileInfo = {
      fileName: filename,
      filePath: filePath,
    };
    data.image = fileInfo.filePath;
    return this.customerService.createCustomerQuery(data);
  }

  @Get('get-all')
  getAllQueries() {
    return this.customerService.getAllQueries();
  }

  @Get('get-single')
  getSingleQuery(@Query('queryId') queryId) {
    return this.customerService.getSingleQuery(queryId);
  }

  @Patch('edit')
  editQuery(@Query('queryId') queryId, @Body() data) {
    return this.customerService.editQuery(queryId, data);
  }

  @Delete('remove')
  deleteQuery(@Query('queryId') queryId) {
    return this.customerService.deleteQuery(queryId);
  }
}
