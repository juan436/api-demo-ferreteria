/**
 * Ferretería - Gestión de Pedidos
 * Copyright (c) 2025 Juan Villegas <juancvillefer@gmail.com>
 * MIT Licensed
 */

import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn, ValidateNested, IsMongoId, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class BranchRefDto {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsIn(['admin', 'user'])
  role: string;

  @ValidateNested()
  @Type(() => BranchRefDto)
  @IsOptional()
  branch?: BranchRefDto;
}
