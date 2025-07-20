import {
    BadRequestException,
    Body,
    Controller, Get, Post, Query
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
        throw new BadRequestException('Parâmetros obrigatórios: uid e tipo_lista.');
      }
  
      return this.listsService.getList(uid_firebase, tipo_lista);
    }

    @Post('/')
    async createReview(@Body() body: any){
      return this.listsService.addBookToList(body);
    }
  }