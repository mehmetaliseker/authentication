import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() body: { username: string; password: string }) {
    return this.usersService.register(body.username, body.password);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.usersService.login(body.username, body.password);
    if (!user) {
      return { success: false, message: 'Giriş başarısız' };
    }
    return { success: true, user };
  }
}
