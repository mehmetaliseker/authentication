import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? "5432", 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'nestdeneme',
      autoLoadEntities: true,
      synchronize: true, // Development için true, production'da false olmalı
      logging: true, // SQL loglarını göster
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
