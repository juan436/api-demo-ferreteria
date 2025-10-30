/**
 * Ferretería - Gestión de Pedidos
 * Copyright (c) 2025 Juan Villegas <juancvillefer@gmail.com>
 * MIT Licensed
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { MailService } from '../mail/mail.service';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private mailService: MailService,
  ) { }

  private generateInvoiceCode(): string {
    const n = Math.floor(Math.random() * 100000);
    return n.toString().padStart(5, '0');
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Ensure invoiceCode exists
    if (!createOrderDto.invoiceCode) {
      createOrderDto.invoiceCode = this.generateInvoiceCode();
    }

    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findByProvider(providerId: string): Promise<Order[]> {
    return this.orderModel
      .find({ 'provider._id': providerId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByBranch(branchId: string): Promise<Order[]> {
    return this.orderModel
      .find({ 'branch._id': branchId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async sendOrderReport(orderId: string, email: string): Promise<void> {
    // 1. Buscar la orden
    const order = await this.orderModel.findById(orderId).exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // 2. Generar el Excel
    const excelBuffer = await this.generateOrderExcel(order);

    // 3. Enviar por email
    const filename = `detalle_pedido_${order.invoiceCode}_${Date.now()}.xlsx`;
    await this.mailService.sendOrderReport(
      email,
      order.invoiceCode,
      excelBuffer,
      filename,
    );
  }

  private async generateOrderExcel(order: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Ferreteria';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Detalle del Pedido');

    // Configurar columnas
    worksheet.columns = [
      { key: 'colA', width: 25 },
      { key: 'colB', width: 25 },
      { key: 'colC', width: 25 },
    ];

    // Logo en la cabecera
    const logoPath = path.join(process.cwd(), 'logo.jpeg');
    worksheet.mergeCells('A1:C1');
    if (fs.existsSync(logoPath)) {
      const logoId = workbook.addImage({ filename: logoPath, extension: 'jpeg' });
      // Posicionar el logo con tamaño específico
      worksheet.addImage(logoId, {
        tl: { col: 0, row: 0 },
        ext: { width: 500, height: 80 },
      });
      worksheet.getRow(1).height = 60;
    } else {
      // Fallback si no existe el logo
      const logoCell = worksheet.getCell('A1');
      logoCell.value = 'FERRETERIA';
      logoCell.font = { size: 20, bold: true, color: { argb: 'FF1E3A8A' } };
      logoCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(1).height = 90;
    }

    // Espacio
    worksheet.addRow([]);

    // Título
    worksheet.mergeCells('A3:C3');
    const titleCell = worksheet.getCell('A3');
    titleCell.value = 'DETALLE DEL PEDIDO';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FF1E3A8A' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(3).height = 30;

    worksheet.addRow([]);

    // Información del pedido
    const orderInfo = [
      ['Factura:', order.invoiceCode],
      ['Proveedor:', order.provider?.name || 'N/A'],
      ['Sucursal:', order.branch?.name || 'N/A'],
      ['Fecha:', new Date(order.date).toLocaleDateString('es-ES')],
      ['Usuario:', order.user?.name || 'N/A'],
    ];

    orderInfo.forEach(([field, value]) => {
      const row = worksheet.addRow([field, value]);
      row.getCell(1).font = { bold: true };
    });

    worksheet.addRow([]);
    worksheet.addRow([]);

    // Header de productos
    worksheet.mergeCells(`A${worksheet.rowCount + 1}:C${worksheet.rowCount + 1}`);
    const productsHeaderCell = worksheet.getCell(`A${worksheet.rowCount}`);
    productsHeaderCell.value = 'PRODUCTOS';
    productsHeaderCell.font = { size: 14, bold: true };
    productsHeaderCell.alignment = { horizontal: 'center' };

    worksheet.addRow([]);

    // Tabla de productos
    const headerRow = worksheet.addRow(['Código', 'Producto', 'Cantidad']);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F3FF' },
      };
    });

    // Datos de productos
    order.items.forEach((item) => {
      worksheet.addRow([item.productCode, item.productName, item.quantity]);
    });

    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
