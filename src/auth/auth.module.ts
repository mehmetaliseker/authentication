import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  // DI
  providers: [AuthService],
  imports: [UsersModule],
  controllers: [AuthController]
})
export class AuthModule {}
