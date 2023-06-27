import { Module } from '@nestjs/common';
import { StampCardService } from './stamp-card.service';
import { StampCardController } from './stamp-card.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StampCard,
  StampCardSchema,
} from '../../data/schemas/stamp-card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StampCard.name,
        schema: StampCardSchema,
      },
    ]),
  ],
  providers: [StampCardService],
  controllers: [StampCardController],
})
export class StampCardModule {}
