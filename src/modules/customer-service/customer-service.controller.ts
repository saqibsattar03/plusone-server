import {
  Controller,
  Delete,
  Patch,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';
import { Body, Get, Post } from '@nestjs/common/decorators';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { CustomerServiceDto } from '../../data/dtos/customerService.dto';

@ApiTags('Customer Service')
@Controller('customer-service')
export class CustomerServiceController {
  constructor(private readonly customerService: CustomerServiceService) {}

  @Post('create')
  @ApiBody({ type: CustomerServiceDto })
  @ApiResponse({ type: CustomerServiceDto })
  @UseGuards(JwtAuthGuard)
  createCustomerQuery(@Request() request, @Body() data) {
    data.userId = request.user.userId;
    return this.customerService.createCustomerQuery(data);
  }

  @Get('get-all')
  @ApiResponse({ type: [CustomerServiceDto] })
  getAllQueries() {
    return this.customerService.getAllQueries();
  }

  @Get('get-single')
  @ApiQuery({ type: String, name: 'queryId' })
  @ApiResponse({ type: CustomerServiceDto })
  getSingleQuery(@Query('queryId') queryId) {
    return this.customerService.getSingleQuery(queryId);
  }

  @Patch('edit')
  @ApiQuery({ type: String, name: 'queryId' })
  @ApiBody({ type: CustomerServiceDto })
  @ApiResponse({ type: CustomerServiceDto })
  editQuery(@Query('queryId') queryId, @Body() data) {
    return this.customerService.editQuery(queryId, data);
  }

  @Delete('remove')
  @ApiQuery({ type: String, name: 'queryId' })
  deleteQuery(@Query('queryId') queryId) {
    return this.customerService.deleteQuery(queryId);
  }
}
