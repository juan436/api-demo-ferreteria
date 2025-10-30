/**
 * Ferretería - Gestión de Pedidos
 * Copyright (c) 2025 Juan Villegas <juancvillefer@gmail.com>
 * MIT Licensed
 */

import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendOrderReport(
    to: string,
    orderInvoiceCode: string,
    excelBuffer: Buffer,
    filename: string,
  ): Promise<boolean> {
    try {
      // Leer el logo
      const logoPath = path.join(process.cwd(), 'logo.jpeg');
      const logoBuffer = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;

      await this.mailerService.sendMail({
        to,
        subject: `Reporte de Pedido #${orderInvoiceCode} - Ferreteria`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              ${logoBuffer ? '<img src="cid:logo" alt="Ferreteria" style="max-width: 220px; height: auto;" />' : '<h1 style="color: #1E3A8A; margin: 0;">FERRETERIA</h1>'}
            </div>
            <div style="padding: 30px; background-color: #f9fafb;">
              <h2 style="color: #1E3A8A;">Reporte de Pedido</h2>
              <p style="font-size: 16px; color: #374151;">
                Adjunto encontrarás el detalle del pedido <strong>#${orderInvoiceCode}</strong> en formato Excel.
              </p>
              <div style="margin: 20px 0; padding: 15px; background-color: #E6F3FF; border-left: 4px solid #1E3A8A;">
                <p style="margin: 0; color: #1E3A8A;">
                  <strong>Número de Factura:</strong> ${orderInvoiceCode}
                </p>
              </div>
              <p style="color: #6B7280; font-size: 14px;">
                Este correo fue generado automáticamente por el sistema de gestión de Ferreteria.
              </p>
            </div>
            <div style="background-color: #374151; padding: 15px; text-align: center;">
              <p style="color: #9CA3AF; margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} Ferreteria. Todos los derechos reservados.
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename,
            content: excelBuffer,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          ...(logoBuffer ? [{
            filename: 'logo.jpeg',
            content: logoBuffer,
            contentType: 'image/jpeg',
            cid: 'logo',
          }] : []),
        ],
      });
      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      return false;
    }
  }
}
