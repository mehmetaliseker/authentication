import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS ayarları
  const corsOrigins = process.env.CORS_ORIGINS;
  const allowedOrigins = corsOrigins ? corsOrigins.split(',').map(origin => origin.trim()) : ['http://localhost:5173', 'http://localhost:5174'];

  app.enableCors({
    origin: allowedOrigins,
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
  const frontendPort = process.env.FRONTEND_PORT || 5173;
  await app.listen(parseInt(port.toString()));
  
  console.log('\n🚀 Server başlatıldı!\n');
  console.log(`🔗 Backend API: http://localhost:${port}`);
  console.log(`🔗 Frontend URL: http://localhost:${frontendPort}`);
  console.log('\n');
}
bootstrap();