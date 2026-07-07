import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEmail, IsIn } from 'class-validator';

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
  @IsNotEmpty()
  customerAddress!: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsNotEmpty()
  dressCode!: string;

  @IsString()
  @IsOptional()
  dressDescription?: string;

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
  @IsIn(['paid', 'unpaid'])
  paymentStatus!: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}