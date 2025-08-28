import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PasswordReset])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
