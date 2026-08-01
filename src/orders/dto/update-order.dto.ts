import {
  IsEnum,
  IsNotEmpty,
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
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status!: OrderStatus;

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
}