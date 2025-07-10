import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
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
}
