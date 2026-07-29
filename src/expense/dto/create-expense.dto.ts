import { IsString, IsNumber, IsNotEmpty, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsNumber()
  @Min(0)
  amount?: number;

  @IsString()
  @IsNotEmpty()
  category?: string;

  @IsDateString()
  date?: string; // "YYYY-MM-DD"

  @IsOptional()
  @IsString()
  description?: string;
}