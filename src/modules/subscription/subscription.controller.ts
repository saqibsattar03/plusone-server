import { Controller } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Body, Post } from '@nestjs/common/decorators';
import { ApiParam } from '@nestjs/swagger';

@Controller('subscribe')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('')
  subscribe(@Body() data) {
    return this.subscriptionService.subscribe(data);
  }
}
