import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
  imports: [HttpModule],
  controllers: [ListsController],
  providers: [ListsService, PrismaService],
})
export class ListsModule {}
