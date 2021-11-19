import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  getAll() {
    return this.userService.getAll();
  }
  getOneByID() {
    return this.userService.getOneByID(1);
  }
}
