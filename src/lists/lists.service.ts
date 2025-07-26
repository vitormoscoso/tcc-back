import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BooksService } from 'src/books/books.service';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ListsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly booksService: BooksService,
  ) {}

  async getList(uid_firebase: string, list_type: string) {
    return this.prisma.listaLivros.findMany({
      where: {
        uid_firebase,
        tipo_lista: list_type as any,
      },
    });
  }

  async getListDetails(uid_firebase: string, list_type: string) {
    const books = await this.getList(uid_firebase, list_type);
    const isbns = books.map((livro) => livro.isbn);

    const details = await Promise.all(
      isbns.map(async (isbn) => {
        try {
          return await this.booksService.getBookDetailsById(isbn);
        } catch {
          return null;
        }
      }),
    );

    return details.filter((book) => book !== null);
  }

  async addBookToList(data: any) {
    return this.prisma.listaLivros.create({
      data: {
        tipo_lista: data.tipo_lista,
        isbn: data.isbn,
        uid_firebase: data.uid_firebase,
      },
    });
  }

  async removeBookFromList(
    uid_firebase: string,
    id: string,
    list_type: string,
  ) {
    return this.prisma.listaLivros.deleteMany({
      where: {
        uid_firebase,
        isbn: id,
        tipo_lista: list_type as any,
      },
    });
  }

  async checkBookInList(uid_firebase: string, id: string) {
    const lists = await this.prisma.listaLivros.findMany({
      where: {
        uid_firebase,
        isbn: id,
      },
      select: {
        tipo_lista: true,
      },
    });

    const types = lists.map((item) => item.tipo_lista);

    return {
      favourites: types.includes('favoritos'),
      to_read: types.includes('para_ler'),
      reviewed: types.includes('avaliados'),
    };
  }
}
