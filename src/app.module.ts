import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { PrismaService } from './database/prisma.service';
import { FirebaseAdminModule } from './firebase/firebase.module';
import { ListsModule } from './lists/lists.module';

@Module({
  imports: [BooksModule, FirebaseAdminModule, ListsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
