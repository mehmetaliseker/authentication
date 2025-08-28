import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS ayarları ekle
  app.enableCors({
    origin: 'http://localhost:5173', // Frontend Vite URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,   // DTO'da tanımlı olmayan alanları siler
    forbidNonWhitelisted: true, // DTO dışında alan varsa hata fırlatır
    transform: true,   // Tip dönüşümünü otomatik yapar
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Server ${port} portunda çalışıyor`);
  console.log(`🌐 Frontend: http://localhost:5173`);
  console.log(`🔧 Backend API: http://localhost:${port}`);
}
bootstrap();