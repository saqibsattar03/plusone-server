import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Quotes, QuotesSchema } from '../../../data/schemas/quotes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Quotes.name,
        schema: QuotesSchema,
      },
    ]),
  ],
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
