/**
 * Ferretería - Gestión de Pedidos
 * Copyright (c) 2025 Juan Villegas <juancvillefer@gmail.com>
 * MIT Licensed
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS for frontend (read from env CORS_ORIGIN, comma-separated)
  const corsOriginEnv = configService.get<string>('CORS_ORIGIN');
  const origins = corsOriginEnv
    ? corsOriginEnv.split(',').map((o) => o.trim()).filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:3001'];
  app.enableCors({
    origin: origins,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port, '0.0.0.0');
  
  console.log(` Server is running on: http://localhost:${port}/api`);
  console.log(` MongoDB URI: ${configService.get<string>('MONGODB_URI')}`);
}

bootstrap();
