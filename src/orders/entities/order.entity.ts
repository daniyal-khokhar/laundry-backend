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

  // NOTE: this stores the NET payable amount (after discount is applied).
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

  // stamped when the order is sent to laundry (status -> processing)
  @Prop({ required: false, type: Date })
  sendingDate?: Date;

  // stamped when the order is received back from laundry (status -> pending)
  @Prop({ required: false, type: Date })
  receivingDate?: Date;

  // ✅ NEW: how many pieces were sent to laundry (from the Send to Laundry dialog)
  @Prop({ required: false, type: Number, default: 0 })
  laundryQuantity?: number;

  // ✅ NEW: discount % applied on the raw item total (0-100)
  @Prop({ required: false, type: Number, default: 0 })
  discountPercent?: number;

  // ✅ NEW: Rs value of the discount taken off the raw item total
  @Prop({ required: false, type: Number, default: 0 })
  discountAmount?: number;

  // ✅ NEW: bill amount after discount — mirrors `price` above
  @Prop({ required: false, type: Number, default: 0 })
  netPayable?: number;

  // ✅ NEW: how much the customer has actually paid/advanced so far
  @Prop({ required: false, type: Number, default: 0 })
  amountReceived?: number;

  // ✅ NEW: signed balance. Positive = customer still owes; negative = advance/credit.
  @Prop({ required: false, type: Number, default: 0 })
  balanceAmount?: number;

  // ✅ NEW: convenience mirror of balanceAmount when positive
  @Prop({ required: false, type: Number, default: 0 })
  balanceDue?: number;

  // ✅ NEW: convenience mirror of |balanceAmount| when the customer overpaid
  @Prop({ required: false, type: Number, default: 0 })
  advanceCredit?: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);