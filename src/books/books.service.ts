import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AuthorsService } from 'src/authors/authors.service';
import { PrismaService } from 'src/database/prisma.service';
import { FirebaseAdminService } from 'src/firebase/firebase.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authorsService: AuthorsService,
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseAdminService,
  ) {}

  private isISBN(input: string): boolean {
    const cleaned = input.replace(/[-\s]/g, '');
    return /^(\d{10}|\d{9}X)$/.test(cleaned) || /^\d{13}$/.test(cleaned);
  }

  async searchBooks(query: string) {
    const cleanedQuery = query.trim();

    if (this.isISBN(cleanedQuery)) {
      const isbn = cleanedQuery.replace(/[-\s]/g, '');
      const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data[`ISBN:${isbn}`];
      if (!data) return [];

      return [
        {
          title: data.title,
          author: data.authors?.[0]?.name || null,
          publishYear: data.publish_date || null,
          coverUrl: data.cover?.large || null,
        },
      ];
    } else {
      const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(cleanedQuery)}`;
      const searchResponse = await firstValueFrom(
        this.httpService.get(searchUrl),
      );
      const docs = searchResponse.data?.docs?.slice(0, 10);

      if (!docs || docs.length === 0) {
        return [];
      }

      const books = docs
        .filter((doc) => !!doc.cover_edition_key) // só resultados com capa principal
        .slice(0, 10) // limite de 10
        .map((doc) => ({
          id: doc.cover_edition_key, // agora o ID é o cover_edition_key
          title: doc.title,
          author: doc.author_name?.[0] || 'Autor desconhecido',
          publishYear: doc.first_publish_year || 'Ano desconhecido',
          coverUrl: doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
            : null,
        }));

      return books;
    }
  }

  async getBooksBySubject(subject: string) {
    const url = `https://openlibrary.org/subjects/${encodeURIComponent(subject)}.json`;
    const response = await firstValueFrom(this.httpService.get(url));
    const works = response.data?.works || [];

    return works
      .filter((work) => work.cover_id && work.cover_edition_key)
      .slice(0, 10)
      .map((work) => ({
        id: work.cover_edition_key,
        title: work.title,
        author: work.authors?.[0]?.name || null,
        publishYear: work.first_publish_year || null,
        coverUrl: work.cover_id
          ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
          : null,
      }));
  }

  async getBookDetailsById(id: string) {
    const url = `https://openlibrary.org/books/${id}.json`;
    const response = await firstValueFrom(this.httpService.get(url));
    const data = response.data;

    const authorKeys = data.authors?.map((a) => a.key) || [];

    const authors = await Promise.all(
      authorKeys.map((key) => this.authorsService.getAuthorData(key)),
    );

    return {
      id,
      title: data.title,
      subtitle: data.subtitle || null,
      description:
        typeof data.description === 'string'
          ? data.description
          : data.description?.value || null,
      publishDate: data.publish_date || null,
      numberOfPages: data.number_of_pages || null,
      coverUrl: data.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
        : null,
      authors: authors.filter(Boolean),
    };
  }

  async getReviewsByBookId(id_livro: string) {
    const resenhas = await this.prisma.resenha.findMany({
      where: { id_livro },
      orderBy: { id_resenha: 'desc' },
      include: {
        comentarios: {
          select: {
            id_comentario: true,
            comentario: true,
            uid_firebase: true,
            id_resposta: true,
          },
        },
      },
    });
  
    return await Promise.all(
      resenhas.map(async (resenha) => {
        const autor = await this.firebase.getUserInfo(resenha.uid_firebase);
  
        // Enriquecer também os autores dos comentários, se necessário
        const comentarios = await Promise.all(
          resenha.comentarios.map(async (comentario) => {
            const autorComentario = await this.firebase.getUserInfo(comentario.uid_firebase);
            return {
              ...comentario,
              autor: autorComentario ?? { displayName: null, photoURL: null },
            };
          })
        );
  
        return {
          id_resenha: resenha.id_resenha,
          comentario: resenha.comentario,
          nota: resenha.nota,
          uid_firebase: resenha.uid_firebase,
          autor: autor ?? { displayName: null, photoURL: null },
          comentarios,
        };
      })
    );
  }

  async createComment(data: any){
    return this.prisma.comentario.create({
      data: {
        id_resenha: data.id_resenha,
        uid_firebase: data.uid_firebase,
        comentario: data.comentario,
        id_resposta: data.id_resposta ?? null,
      },
    });
  }
}
