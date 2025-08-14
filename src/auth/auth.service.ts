import { Injectable } from '@nestjs/common';
import { AuthRepository } from './interface/auth.repository';
import * as bcrypt from 'bcrypt';

interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable()
export class AuthService implements AuthRepository {
  private users: User[] = [];
  private loggedInUsers: string[] = [];
  private idCounter = 1;

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async register(username: string, password: string) {
    const existing = this.users.find(u => u.username === username);
    if (existing) {
      return { success: false, message: 'Bu kullanıcı adı zaten mevcut' };
    }

    const newUser: User = {
      id: this.idCounter++,
      username,
      password: await this.hashPassword(password)
    };

    this.users.push(newUser);
    return { success: true, user: { id: newUser.id, username: newUser.username } };
  }

  async validateUser(username: string, password: string) {
    const user = this.users.find(u => u.username === username);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      return { success: false, message: 'Geçersiz kullanıcı adı veya şifre' };
    }

    this.loggedInUsers.push(username);
    return { success: true, message: 'Giriş başarılı', user: { username: user.username } };
  }

  async logout(username: string) {
    this.loggedInUsers = this.loggedInUsers.filter(u => u !== username);
    return { success: true, message: 'Çıkış yapıldı' };
  }
}