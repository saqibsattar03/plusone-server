import { Controller, Delete, Patch, Query } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { Body, Get, Post } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { QuoteDto } from '../../data/dtos/quote.dto';

@ApiTags('Admin Quotes')
@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post('/create')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quoteText: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ type: String, description: 'quote added successfully' })
  @ApiBadRequestResponse({ type: String, description: 'bad request' })
  createPost(@Body() data) {
    return this.quoteService.createQuote(data);
  }

  @Get('/all')
  @ApiCreatedResponse({ type: [QuoteDto] })
  getAllQuotes() {
    return this.quoteService.getAllQuotes();
  }
  @Get()
  @ApiQuery({ type: String, name: 'quoteId' })
  @ApiCreatedResponse({ type: QuoteDto })
  @ApiBadRequestResponse({
    type: String,
    description: 'could not fetch single quote',
  })
  getSingleQuote(@Query('quoteId') quoteId) {
    return this.quoteService.getSingleQuote(quoteId);
  }
  @Patch('/edit')
  @ApiQuery({ type: String, name: 'quoteId' })
  @ApiCreatedResponse({ type: QuoteDto })
  @ApiBadRequestResponse({ type: String, description: 'could not edit quote' })
  editQuote(@Query('quoteId') quoteId, @Body() data) {
    return this.quoteService.editQuote(quoteId, data);
  }
  @Delete('/remove')
  @ApiQuery({ type: String, name: 'quoteId' })
  @ApiCreatedResponse({ type: QuoteDto })
  @ApiBadRequestResponse({
    type: String,
    description: 'could not delete quote',
  })
  deleteQuote(@Query('quoteId') quoteId) {
    return this.quoteService.deleteQuote(quoteId);
  }
}
