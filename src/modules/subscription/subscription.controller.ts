import { Controller } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Body, Post } from '@nestjs/common/decorators';

@Controller('subscribe')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  subscribe(@Body() data) {
    console.log('here in subscription');
    return this.subscriptionService.subscribe(data);
  }
}
