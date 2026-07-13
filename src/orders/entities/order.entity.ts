import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

// ✨ NEW: Sub-schema for a single cart item — { id, serviceType, quantity, itemPrice }
@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  serviceType!: string;

  @Prop({ required: true, type: Number })
  quantity!: number;

  @Prop({ required: true, type: Number })
  itemPrice!: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  branchId!: string;

  @Prop({ required: true })
  branchCode!: string;

  @Prop({ required: true })
  customerName!: string;

  @Prop({ required: true })
  customerPhone!: string;

  @Prop({ required: false, default: '' })
  customerAddress!: string;

  @Prop({ required: false, default: '' })
  customerEmail!: string;

  @Prop({ required: true })
  dressCode!: string;

  @Prop({ required: false, default: '' })
  dressDescription!: string;

  // ✨ NEW: multiple items (cart) belonging to this order
  @Prop({ type: [OrderItemSchema], default: [] })
  itemsList!: OrderItem[];

  // Kept for backward compatibility with existing list/filter/report code.
  // These hold the aggregate of itemsList: first item's serviceType,
  // sum of quantities, and grand total price.
  @Prop({ required: true })
  serviceType!: string;

  @Prop({ required: true, type: Number })
  quantity!: number;

  @Prop({ required: true, type: Number })
  price!: number;

  @Prop({ required: true, default: 'unpaid' })
  paymentStatus!: string;

  @Prop({ required: true, default: 'cash' })
  paymentMethod!: string;

  @Prop({ required: false, default: '' })
  notes!: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);