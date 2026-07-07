import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

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

  @Prop({ required: true })
  customerAddress!: string;

  @Prop({ required: false, default: '' })
  customerEmail!: string;

  @Prop({ required: true })
  dressCode!: string;

  @Prop({ required: false, default: '' })
  dressDescription!: string;

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