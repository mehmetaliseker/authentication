import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      username: 'mamis',
      password: bcrypt.hashSync('1234', 10),
    },
  ];

  async findByUsername(username: string) {
    return this.users.find(user => user.username === username);
  }

  async register(username: string, password: string) {
    const existing = await this.findByUsername(username);
    if (existing) {
      return { success: false, message: 'kullanici zaten var' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      username,
      password: hashedPassword,
    };
    this.users.push(newUser);

    return { success: true, user: { id: newUser.id, username: newUser.username } };
  }

  async login(username: string, password: string) {
    const user = await this.findByUsername(username);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return { id: user.id, username: user.username };
  }
}