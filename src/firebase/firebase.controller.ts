import { Controller, Get, Param } from '@nestjs/common';
import { FirebaseAdminService } from './firebase.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: FirebaseAdminService) {}

  @Get(':uid')
  async getUserInfo(@Param('uid') uid: string) {
    return this.usersService.getUserInfo(uid);
  }
}
