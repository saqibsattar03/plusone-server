import { Controller, Query } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { Get } from '@nestjs/common/decorators';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionHistoryDto } from '../../data/dtos/transactionHistory.dto';

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
    console.log(type);
    return this.transactionHistoryService.getRestaurantTransactionHistory(
      restaurantId,
      type,
    );
  }
}
