import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Docker container hostname veya network host
      port: 5432,
      username: 'postgres',
      password: 'postgres', // container şifresi
      database: 'nestdeneme',
      entities: [User],
      synchronize: false, // otomatik tablo oluşturma
    }),
    AuthModule,
  ],
})
export class AppModule {}
