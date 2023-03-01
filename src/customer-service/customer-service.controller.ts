import { Controller, Delete, Patch, Query } from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';
import { Body, Get, Post } from '@nestjs/common/decorators';

@Controller('customer-service')
export class CustomerServiceController {
  constructor(private readonly customerService: CustomerServiceService) {}

  @Post('create')
  createCustomerQuery(@Body() data) {
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
