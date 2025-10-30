/**
 * Ferretería - Gestión de Pedidos
 * Copyright (c) 2025 Juan Villegas <juancvillefer@gmail.com>
 * MIT Licensed
 */

import { IsNotEmpty, IsString, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class BranchRefDto {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateProviderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => BranchRefDto)
  branch: BranchRefDto;
}
