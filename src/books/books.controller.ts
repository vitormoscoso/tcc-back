import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async searchBooks(@Query('q') query: string) {
    if (!query) {
      throw new BadRequestException('Você deve fornecer um valor de busca.');
    }

    return this.booksService.searchBooks(query);
  }

  @Get('categories')
  async getBooksBySubject(@Query('subject') subject: string) {
    if (!subject) {
      throw new BadRequestException('Você deve informar um assunto.');
    }
    return this.booksService.getBooksBySubject(subject);
  }

  @Get(':id')
  async getBookDetails(@Param('id') id: string) {
    return this.booksService.getBookDetailsById(id);
  }

  @Get(':id/reviews')
  async getReviews(@Param('id') id: string) {
    return this.booksService.getReviewsByBookId(id);
  }

  @Post('review/comment')
  async createComment(@Body() body: any){
    return this.booksService.createComment(body);
  }
}
