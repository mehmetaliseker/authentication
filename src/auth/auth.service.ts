import { Injectable } from '@nestjs/common';
import { AuthRepository } from './interface/auth.repository';
import * as bcrypt from 'bcrypt';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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

  async register(username: string, email: string, password: string, firstName: string, lastName: string) {
    const existing = this.users.find(u => u.email === email);
    if (existing) {
      return { success: false, message: 'Bu email ile kullanıcı zaten var' };
    }

    const newUser: User = {
      id: this.idCounter++,
      username,
      email,
      password: await this.hashPassword(password),
      firstName,
      lastName
    };

    this.users.push(newUser);
    return { success: true, user: { ...newUser, password: undefined } };
  }

  async validateUser(email: string, password: string) {
    const user = this.users.find(u => u.email === email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }


  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      return { success: false, message: 'Geçersiz email veya şifre' };
    }

    this.loggedInUsers.push(email);
    return { success: true, message: 'Giriş başarılı', user: { ...user, password: undefined } };
  }

  async logout(email: string) {
    this.loggedInUsers = this.loggedInUsers.filter(u => u !== email);
    return { success: true, message: 'Çıkış yapıldı' };
  }
}
