import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthorsService {
  constructor(private readonly httpService: HttpService) {}

  async getAuthorData(
    key: string,
  ): Promise<{ id: string; name: string } | null> {
    try {
      const url = `https://openlibrary.org${key}.json`;
      const response = await firstValueFrom(this.httpService.get(url));
      return {
        id: key.replace('/authors/', ''),
        name: response.data.name,
      };
    } catch {
      return null;
    }
  }
}
