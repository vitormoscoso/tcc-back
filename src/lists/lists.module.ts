import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthorsService } from 'src/authors/authors.service';
import { BooksService } from 'src/books/books.service';
import { PrismaService } from 'src/database/prisma.service';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
  imports: [HttpModule],
  controllers: [ListsController],
  providers: [ListsService, PrismaService, BooksService, AuthorsService],
})
export class ListsModule {}
