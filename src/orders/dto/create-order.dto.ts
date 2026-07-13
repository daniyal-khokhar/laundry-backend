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
} from 'class-validator';
import { Type } from 'class-transformer';

// ✨ Ek single item ka shape jo "itemsList" array ke andar aata hai
// { id, serviceType, quantity, itemPrice }
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

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsNotEmpty()
  dressCode!: string;

  @IsString()
  @IsOptional()
  dressDescription?: string;

  // ✨ NEW: multiple items per order (cart). At least one item required.
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  itemsList!: OrderItemDto[];

  // Kept for backward compatibility / quick filtering & list display.
  // Frontend sends these as the aggregate of itemsList (first item's serviceType,
  // total quantity, and grand total price) so old dashboards/reports still work.
  @IsString()
  @IsNotEmpty()
  serviceType!: string;

  @IsNumber()
  @IsNotEmpty()
  quantity!: number;

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
}