import { IsString, IsNumber, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  itemName!: string;   // ✅ '!' add kiya

  @IsNumber()
  @Min(0)
  price!: number;      // ✅ '!' add kiya

  @IsString()
  @IsNotEmpty()
  perItem!: string;    // ✅ '!' add kiya

  @IsString()
  @IsNotEmpty()
  type!: string;       // ✅ '!' add kiya

  @IsString()
  @IsOptional()
  description?: string; // ✅ optional hai isliye '?' hi kaafi hai, error nahi ayega
}