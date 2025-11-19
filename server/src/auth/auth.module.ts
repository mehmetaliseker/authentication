import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { FriendshipController } from './controllers/friendship.controller';
import { MessageController } from './controllers/message.controller';
import { AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';
import { FirebaseService } from './services/firebase.service';
import { UserLoginLogService } from './services/user-login-log.service';
import { FriendshipService } from './services/friendship.service';
import { MessageService } from './services/message.service';
import { UserRepository } from './repositories/user.repository';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { LogoutLogRepository } from './repositories/logout-log.repository';
import { UserLoginLogRepository } from './repositories/user-login-log.repository';
import { FriendshipRepository } from './repositories/friendship.repository';
import { MessageRepository } from './repositories/message.repository';
import { DatabaseService } from '../database/database.service';
import { SocketGateway } from './gateways/socket.gateway';

@Module({
  controllers: [AuthController, FriendshipController, MessageController],
  providers: [
    AuthService,
    JwtService,
    FirebaseService,
    UserLoginLogService,
    FriendshipService,
    MessageService,
    UserRepository,
    PasswordResetRepository,
    LogoutLogRepository,
    UserLoginLogRepository,
    FriendshipRepository,
    MessageRepository,
    DatabaseService,
    SocketGateway,
  ],
  exports: [AuthService, JwtService, UserLoginLogService, FriendshipService, MessageService],
})
export class AuthModule {}
