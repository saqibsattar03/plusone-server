import { Body, Controller, Post, Query } from '@nestjs/common';
import { DepositMoneyService } from './deposit-money.service';
import { Get } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Accounts')
@Controller('deposit-money')
export class DepositMoneyController {
  constructor(private readonly depositMoneyService: DepositMoneyService) {}

  @Post()
  deposit(@Query('restaurantId') restaurantId, @Body() data) {
    return this.depositMoneyService.deposit(data, restaurantId);
  }

  @Get()
  sumOfDepositedAmount(@Query('restaurantId') restaurantId) {
    return this.depositMoneyService.sumOfDepositedAmount(restaurantId);
  }
}
