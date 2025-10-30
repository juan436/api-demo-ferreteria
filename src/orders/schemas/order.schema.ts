/**
 * Ferretería - Gestión de Pedidos
 * Copyright (c) 2025 Juan Villegas <juancvillefer@gmail.com>
 * MIT Licensed
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class OrderItem {
  @Prop({ required: true })
  productCode: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;
}

class BranchRef {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;
}

class UserRef {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;
}

class ProviderRef {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;
}

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: ProviderRef, required: true })
  provider: ProviderRef;

  @Prop({ required: true, match: /^\d{5}$/ })
  invoiceCode: string;

  @Prop({ type: UserRef, required: true })
  user: UserRef;

  @Prop({ required: true })
  date: Date;

  @Prop({ 
    required: true, 
    enum: ['pending', 'completed', 'cancelled'], 
    default: 'pending' 
  })
  status: string;

  @Prop({ type: BranchRef, required: true })
  branch: BranchRef;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
