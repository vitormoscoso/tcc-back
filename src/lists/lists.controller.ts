import {
    Body,
    Controller, Post
} from '@nestjs/common';
import { ListsService } from './lists.service';
  
  @Controller('lists')
  export class ListsController {
    constructor(private readonly listsService: ListsService) {}

    @Post('/')
    async createReview(@Body() body: any){
      return this.listsService.addBookToList(body);
    }
  }