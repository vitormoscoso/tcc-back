import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AuthorsService } from 'src/authors/authors.service';
import { PrismaService } from 'src/database/prisma.service';
import { FirebaseAdminService } from 'src/firebase/firebase.service';


@Injectable()
export class ListsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseAdminService,
  ) {}

  async getList(uid_firebase: string, list_type: string) {
    return this.prisma.listaLivros.findMany({
      where: {
        uid_firebase,
        tipo_lista: list_type as any
      },
    });
  }

  async addBookToList(data: any){
    return this.prisma.listaLivros.create({
      data: {
        tipo_lista: data.tipo_lista,
        isbn: data.isbn,
        uid_firebase: data.uid_firebase,
      },
    });
  }
}