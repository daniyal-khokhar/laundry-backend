import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEmail,
  IsIn,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  Min,
  Max,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../enums/order-status.enum';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  serviceType!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  itemPrice!: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  branchId!: string;

  @IsString()
  @IsNotEmpty()
  branchCode!: string;

  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsString()
  @IsNotEmpty()
  customerPhone!: string;

  @IsString()
  @IsOptional()
  customerAddress?: string;

  @IsString()
  @IsNotEmpty()
  dressCode!: string;

  @IsString()
  @IsOptional()
  dressDescription?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  itemsList!: OrderItemDto[];

  @IsString()
  @IsNotEmpty()
  serviceType!: string;

  @IsNumber()
  @IsNotEmpty()
  quantity!: number;

  // ✅ NOTE: this is the NET payable amount (after discount is applied) —
  // the frontend sends grandTotal - discountAmount here as `price`.
  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsString()
  @IsIn(['paid', 'unpaid', 'partial'])
  paymentStatus!: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod!: string;

  @IsString()
  @IsOptional()
  notes?: string;

  // ✅ STATUS FIELD WITH ENUM
  @IsEnum(OrderStatus)
  @IsOptional()
  status!: OrderStatus;

  // ✅ NEW: delivery date selected on the order form
  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  // optional, normally only set via the send/receive-laundry endpoints,
  // but allowed here in case an order is created directly with a known history.
  @IsDateString()
  @IsOptional()
  sendingDate!: string;

  @IsDateString()
  @IsOptional()
  receivingDate!: string;

  // ✅ NEW: discount % applied on the raw item total (0-100).
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  // ✅ NEW: Rs value of the discount (grandTotal * discountPercent / 100).
  @IsNumber()
  @IsOptional()
  @Min(0)
  discountAmount?: number;

  // ✅ NEW: bill amount after discount — should equal `price` above.
  @IsNumber()
  @IsOptional()
  @Min(0)
  netPayable?: number;

  // ✅ NEW: how much the customer has actually paid/advanced right now.
  @IsNumber()
  @IsOptional()
  amountReceived?: number;

  // ✅ NEW: signed balance. Positive = customer still owes this much.
  // Negative = customer overpaid (this is their advance/credit).
  @IsNumber()
  @IsOptional()
  balanceAmount?: number;

  // ✅ NEW: convenience mirror of balanceAmount when positive (>= 0 always).
  @IsNumber()
  @IsOptional()
  @Min(0)
  balanceDue?: number;

  // ✅ NEW: convenience mirror of |balanceAmount| when the customer overpaid.
  @IsNumber()
  @IsOptional()
  @Min(0)
  advanceCredit?: number;
}

// ✅ dedicated DTO for the status-update endpoint (PATCH /orders/:id/status).
// Used for the plain "Mark as Ready" / "Mark as Delivered" actions AND for the
// laundry "Send to Laundry" (status -> processing, sendingDate stamped) and
// "Received from Laundry" (status -> pending, receivingDate stamped) actions.
export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status!: OrderStatus;

  @IsDateString()
  @IsOptional()
  sendingDate?: string;

  @IsDateString()
  @IsOptional()
  receivingDate?: string;

  // ✅ NEW: how many pieces were sent to laundry, set when status -> processing
  // via the "Send to Laundry" quantity dialog on the frontend.
  @IsNumber()
  @IsOptional()
  @Min(1)
  laundryQuantity?: number;

    // ✅ Ensure all new fields are optional and can be updated
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discountAmount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  netPayable?: number;

  @IsNumber()
  @IsOptional()
  amountReceived?: number;

  @IsNumber()
  @IsOptional()
  balanceAmount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  balanceDue?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  advanceCredit?: number;

  // ✅ NEW: delivery date selected on the order form
  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  @IsString()
  @IsOptional()
  @IsIn(['paid', 'unpaid', 'partial'])
  paymentStatus?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}

export class ApplyPaymentDto {
  @IsString()
  @IsNotEmpty()
  dressCode!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @IsIn(['cash', 'account', 'online'])
  paymentMethod!: string;
}