import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { PasswordReset } from '../auth/entities/password-reset.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',   
      database: 'mydb',
      entities: [User, PasswordReset],
      synchronize: false, 
    }),
  ],
})
export class DatabaseModule {}