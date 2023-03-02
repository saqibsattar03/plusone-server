import { Controller, Delete, Patch, Query } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { Body, Get, Post } from '@nestjs/common/decorators';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post('create')
  createPost(@Body() data) {
    return this.quoteService.createQuote(data);
  }

  @Get('get-all')
  getAllQuotes() {
    return this.quoteService.getAllQuotes();
  }

  @Get('get-single')
  getSingleQuote(@Query('quoteId') quoteId) {
    return this.quoteService.getSingleQuote(quoteId);
  }
  @Patch('edit')
  editQuote(@Query('quoteId') quoteId, @Body() data) {
    return this.quoteService.editQuote(quoteId, data);
  }

  @Delete('remove')
  deleteQuote(@Query('quoteId') quoteId) {
    return this.quoteService.deleteQuote(quoteId);
  }
}
