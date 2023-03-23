import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuoteDocument, Quotes } from '../../../data/schemas/quotes.schema';
import { Model } from 'mongoose';
import { QuoteDto } from '../../../data/dtos/quote.dto';
import { QuoteModule } from './quote.module';

@Injectable()
export class QuoteService {
  constructor(
    @InjectModel(Quotes.name) private readonly quoteModel: Model<QuoteDocument>,
  ) {}

  async createQuote(quoteDto: QuoteDto): Promise<QuoteDocument> {
    const quote = await this.quoteModel.create(quoteDto);
    return quote;
  }

  async getAllQuotes(): Promise<QuoteDocument[]> {
    return this.quoteModel.find();
  }

  async getSingleQuote(quoteId): Promise<QuoteDocument> {
    return this.quoteModel.findById({ _id: quoteId });
  }
  async editQuote(quoteId, quoteDto: QuoteDto): Promise<QuoteDocument> {
    const quote = await this.quoteModel.findByIdAndUpdate(
      { _id: quoteId },
      { quoteText: quoteDto.quoteText },
    );
    return quote;
  }

  async deleteQuote(quoteId): Promise<QuoteDocument> {
    return this.quoteModel.findByIdAndDelete({ _id: quoteId });
  }
}
