/**
 * Ferretería - Gestión de Pedidos
 * Copyright (c) 2025 Juan Villegas <juancvillefer@gmail.com>
 * MIT Licensed
 */

import { IsNotEmpty, IsString, IsArray, IsIn, ValidateNested, IsNumber, IsDateString, IsOptional, Matches, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class RefDto {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => RefDto)
  provider: RefDto;

  @IsString()
  @IsOptional()
  @Matches(/^\d{5}$/)
  invoiceCode?: string;

  @ValidateNested()
  @Type(() => RefDto)
  user: RefDto;

  @IsDateString()
  date: string;

  @IsString()
  @IsIn(['pending', 'completed', 'cancelled'])
  status: string;

  @ValidateNested()
  @Type(() => RefDto)
  branch: RefDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
