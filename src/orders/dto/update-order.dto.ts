import {
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  IsString,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { OrderStatus } from '../../enums/order-status.enum';

export class UpdateOrderDto {
  // ✅ FIX: was @IsNotEmpty() with no @IsOptional() — that forced EVERY
  // partial update (even ones that only touch advanceCredit, balanceDue,
  // etc.) to also include a valid `status`, otherwise class-validator
  // rejected the whole request with:
  // "status must be one of the following values: pending, processing, ready, delivered"
  // Now status can be omitted; if it IS sent, it still must be a valid enum value.
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  // Send to Laundry
  @IsDateString()
  @IsOptional()
  sendingDate?: string;

  // Receive from Laundry
  @IsDateString()
  @IsOptional()
  receivingDate?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  laundryQuantity?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  receivedQuantity?: number;

  // Deliver Order — payment confirmation fields
  @IsNumber()
  @IsOptional()
  amountReceived?: number;

  @IsString()
  @IsOptional()
  @IsIn(['paid', 'unpaid', 'partial'])
  paymentStatus?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

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

  @IsDateString()
  @IsOptional()
  deliveredDate?: string;

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

  // ✅ Also added — needed because when editing an order (New Order page's
  // "Edit" mode) the frontend sends these fields too. Without declaring
  // them here, NestJS's ValidationPipe (if whitelist:true is on) silently
  // strips them out, meaning edits to customer info / items / dress code
  // wouldn't actually save. Optional here, no runtime behavior change
  // for calls that don't send them.
  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsString()
  @IsOptional()
  customerAddress?: string;

  @IsString()
  @IsOptional()
  dressCode?: string;

  @IsString()
  @IsOptional()
  dressDescription?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  @IsString()
  @IsOptional()
  serviceType?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsOptional()
  itemsList?: any[];

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  branchCode?: string;
}