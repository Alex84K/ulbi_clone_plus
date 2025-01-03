import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UserCreateDto } from './users/types';
import { User } from './users/user.entity';

@Controller('/api')
export class AppController {
  constructor(
    private readonly appService: AppService,

  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
