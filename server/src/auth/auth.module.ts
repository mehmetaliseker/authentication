import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';
import { FirebaseService } from './services/firebase.service';
import { UserRepository } from './repositories/user.repository';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { LogoutLogRepository } from './repositories/logout-log.repository';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    FirebaseService,
    UserRepository,
    PasswordResetRepository,
    LogoutLogRepository,
    DatabaseService
  ],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
