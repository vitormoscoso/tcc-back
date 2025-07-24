import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ListsService } from './lists.service';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get()
  async getListaDoUsuario(
    @Query('uid') uid_firebase: string,
    @Query('tipo_lista') tipo_lista: string,
  ) {
    if (!uid_firebase || !tipo_lista) {
      throw new BadRequestException(
        'Parâmetros obrigatórios: uid e tipo_lista.',
      );
    }

    return this.listsService.getList(uid_firebase, tipo_lista);
  }

  @Get('check')
  async checkBookInList(
    @Query('uid_firebase') uid: string,
    @Query('id') id: string,
  ) {
    if (!uid || !id) {
      throw new BadRequestException(
        'Parâmetros uid_firebase e id são obrigatórios.',
      );
    }

    return this.listsService.checkBookInList(uid, id);
  }

  @Post('/')
  async addBook(@Body() body: any) {
    return this.listsService.addBookToList(body);
  }

  @Delete('/')
  async removeBook(@Body() body: any) {
    return this.listsService.removeBookFromList(
      body.uid_firebase,
      body.id,
      body.list_type,
    );
  }
}
