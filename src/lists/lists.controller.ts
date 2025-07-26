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

  @Get('details')
  async getListDetails(
    @Query('uid') uid_firebase: string,
    @Query('tipo_lista') tipo_lista: string,
  ) {
    if (!uid_firebase || !tipo_lista) {
      throw new BadRequestException(
        'Parâmetros obrigatórios: uid e tipo_lista.',
      );
    }

    return this.listsService.getListDetails(uid_firebase, tipo_lista);
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
  async removeBook(
    @Query('uid_firebase') uid: string,
    @Query('id') id: string,
    @Query('list_type') list_type: string,
  ) {

    if (!uid || !id || !list_type) {
      throw new BadRequestException(
        'Parâmetros uid_firebase, id e list_type são obrigatórios.',
      );
    }

    return this.listsService.removeBookFromList(uid, id, list_type);
  }
}
