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
  IsEnum,
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
}