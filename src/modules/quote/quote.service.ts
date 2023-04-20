import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuoteDocument, Quotes } from '../../data/schemas/quotes.schema';
import { Model } from 'mongoose';
import { QuoteDto } from '../../data/dtos/quote.dto';

@Injectable()
export class QuoteService {
  constructor(
    @InjectModel(Quotes.name) private readonly quoteModel: Model<QuoteDocument>,
  ) {}

  async createQuote(quoteDto: QuoteDto): Promise<QuoteDocument> {
    return this.quoteModel.create(quoteDto);
  }

  async getAllQuotes(): Promise<QuoteDocument[]> {
    return this.quoteModel.find();
  }

  async getSingleQuote(quoteId): Promise<QuoteDocument> {
    return this.quoteModel.findById({ _id: quoteId });
  }
  async editQuote(quoteId, quoteDto: QuoteDto): Promise<QuoteDocument> {
    return this.quoteModel.findByIdAndUpdate(
      quoteId,
      {
        quoteText: quoteDto.quoteText,
      },
      { returnDocument: 'after' },
    );
  }

  async deleteQuote(quoteId): Promise<QuoteDocument> {
    await this.quoteModel.findByIdAndDelete({ _id: quoteId });
    throw new HttpException('quote deleted successfully', HttpStatus.OK);
  }
}
