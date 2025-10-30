/**
 * Ferretería - Gestión de Pedidos
 * Copyright (c) 2025 Juan Villegas <juancvillefer@gmail.com>
 * MIT Licensed
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  console.log('🌱 Seeding: create default admin user...');

  try {
    await usersService.create({
      email: 'admin@ferreteria.com',
      name: 'Administrador',
      password: 'admin123',
      role: 'admin',
      branch: null as any,
    });
    console.log('  ✓ Admin user created: admin@ferreteria.com / admin123');
  } catch (error: any) {
    console.log(`  ⚠ Admin already exists or error: ${error.message}`);
  } finally {
    await app.close();
  }
}

bootstrap();