import { Controller, Query } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { Get, Post } from '@nestjs/common/decorators';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionHistoryDto } from '../../data/dtos/transaction-history.dto';

@ApiTags('Transaction History')
@Controller('transaction-history')
export class TransactionHistoryController {
  constructor(
    private readonly transactionHistoryService: TransactionHistoryService,
  ) {}
  @Get()
  @ApiQuery({ type: String, name: 'restaurantId', required: false })
  @ApiQuery({ type: String, name: 'type', required: false })
  @ApiResponse({ type: [TransactionHistoryDto] })
  getRestaurantTransactionHistory(
    @Query('restaurantId') restaurantId,
    @Query('type') type,
  ) {
    return this.transactionHistoryService.getRestaurantTransactionHistory(
      restaurantId,
      type,
    );
  }

  @Post('/generate-invoice')
  @ApiQuery({ type: String, name: 'restaurantId' })
  @ApiQuery({ type: String, name: 'startDate' })
  @ApiQuery({ type: String, name: 'endDate' })
  generateInvoice(
    @Query('restaurantId') restaurantId,
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    return this.transactionHistoryService.generateInvoice(
      restaurantId,
      startDate,
      endDate,
    );
  }
}
