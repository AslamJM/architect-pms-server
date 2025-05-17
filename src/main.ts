import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:5173', 'https://example.com'],

  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
