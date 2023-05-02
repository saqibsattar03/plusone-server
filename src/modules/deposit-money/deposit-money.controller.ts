import { Body, Controller, Post, Query } from '@nestjs/common';
import { DepositMoneyService } from './deposit-money.service';
import { Get } from '@nestjs/common/decorators';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Accounts')
@Controller('deposit-money')
export class DepositMoneyController {
  constructor(private readonly depositMoneyService: DepositMoneyService) {}

  @Post()
  @ApiQuery({ type: String, name: 'restaurantId' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        depositObject: {
          type: 'object',
          properties: {
            amount: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        depositObject: {
          type: 'object',
          properties: {
            amount: { type: 'number' },
            createdAt: { type: '2023-05-02' },
          },
        },
      },
    },
  })
  deposit(@Query('restaurantId') restaurantId, @Body() data) {
    return this.depositMoneyService.deposit(data, restaurantId);
  }

  @Get()
  @ApiQuery({ type: String, name: 'restaurantId' })
  sumOfDepositedAmountBySingleRestaurant(@Query('restaurantId') restaurantId) {
    return this.depositMoneyService.sumOfDepositedAmountBySingleRestaurant(
      restaurantId,
    );
  }

  @Get('all-restaurants')
  sumOfDepositedAmountByAllRestaurant() {
    return this.depositMoneyService.sumOfDepositedAmountByAllRestaurant();
  }

  @Get('history')
  @ApiQuery({ type: String, name: 'restaurantId' })
  depositHistory(@Query('restaurantId') restaurantId) {
    return this.depositMoneyService.depositHistory(restaurantId);
  }
}
