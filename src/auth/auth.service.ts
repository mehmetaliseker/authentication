import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // DI
  constructor(private userService: UsersService) {}

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Kullanivi bulunamadi');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Şifre yanliş');
    }

    return {
      message: 'Giriş başarli',
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }
}