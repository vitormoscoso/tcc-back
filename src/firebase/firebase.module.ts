import { Global, Module } from '@nestjs/common';
import { FirebaseAdminService } from './firebase.service';

@Global() // Disponível globalmente sem importar em cada módulo
@Module({
  providers: [FirebaseAdminService],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule {}
