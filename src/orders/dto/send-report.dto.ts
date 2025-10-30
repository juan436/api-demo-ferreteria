/**
 * Ferretería - Gestión de Pedidos
 * Copyright (c) 2025 Juan Villegas <juancvillefer@gmail.com>
 * MIT Licensed
 */

import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendReportDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
