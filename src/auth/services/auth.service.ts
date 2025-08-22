import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly authRepo: AuthRepository,
  ) {}

  async register(dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.authRepo.create({
      ...dto,
      password_hash: hash,
    });
    return this.authRepo.save(user);
  }

  async login(dto: LoginDto) {
    const user = await this.authRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    user.last_login = new Date();
    await this.authRepo.save(user);

    return { message: 'Login successful', userId: user.id };
  }

  async forgotPassword(email: string) {
    return { message: 'Reset link sent (simulate)' };
  }
}