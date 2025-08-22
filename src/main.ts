import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,   // DTO’da tanımlı olmayan alanları siler
    forbidNonWhitelisted: true, // DTO dışında alan varsa hata fırlatır
    transform: true,   // Tip dönüşümünü otomatik yapar
  }));

  await app.listen(3000);
}
bootstrap();