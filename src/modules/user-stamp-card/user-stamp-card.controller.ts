import { Controller } from '@nestjs/common';
import { UserStampCardService } from './user-stamp-card.service';
import { Body, Post } from '@nestjs/common/decorators';
import { UserStampCardDto } from '../../data/dtos/userStampCard.dto';

@Controller('user-stamp-card')
export class UserStampCardController {
  constructor(private readonly userStampCardService: UserStampCardService) {}

  @Post()
  createStampCard(@Body() data: UserStampCardDto) {
    return this.userStampCardService.createStampCard(data);
  }
}
