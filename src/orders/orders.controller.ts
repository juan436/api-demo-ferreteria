/**
 * Ferretería - Gestión de Pedidos
 * Copyright (c) 2025 Juan Villegas <juancvillefer@gmail.com>
 * MIT Licensed
 */

import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SendReportDto } from './dto/send-report.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('by-provider/:providerId')
  findByProvider(@Param('providerId') providerId: string) {
    return this.ordersService.findByProvider(providerId);
  }

  @Get('by-branch/:branch')
  findByBranch(@Param('branch') branch: string) {
    return this.ordersService.findByBranch(branch);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Post(':id/send-report')
  async sendReport(
    @Param('id') id: string,
    @Body() sendReportDto: SendReportDto,
  ) {
    await this.ordersService.sendOrderReport(id, sendReportDto.email);
    return { message: 'Report sent successfully' };
  }
}
