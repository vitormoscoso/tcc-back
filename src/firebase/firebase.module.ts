import { Global, Module } from '@nestjs/common';
import { UsersController } from './firebase.controller';
import { FirebaseAdminService } from './firebase.service';

@Global() // Disponível globalmente sem importar em cada módulo
@Module({
  providers: [FirebaseAdminService],
  controllers: [UsersController],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule {}
