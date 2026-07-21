import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderStatus } from '../../enums/order-status.enum';

export type OrderDocument = Order & Document;

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

  @Prop({ required: true })
  dressCode!: string;

  @Prop({ required: false, default: '' })
  dressDescription!: string;

  @Prop({ type: [OrderItemSchema], default: [] })
  itemsList!: OrderItem[];

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

  // ✅ STATUS FIELD - YAHAN SE RESPONSE MEIN AANI CHAHIYE
  @Prop({ 
    required: true, 
    default: OrderStatus.PENDING,
    enum: OrderStatus
  })
  status!: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);