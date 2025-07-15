import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthorsService } from 'src/authors/authors.service';
import { PrismaService } from 'src/database/prisma.service';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [HttpModule],
  controllers: [BooksController],
  providers: [BooksService, AuthorsService, PrismaService],
})
export class BooksModule {}
