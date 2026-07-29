import { IsOptional, IsString, IsIn } from 'class-validator';

export class DashboardQueryDto {
  @IsOptional()
  @IsString()
  branchId?: string;
}

export class RevenueQueryDto {
  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly'])
  period?: 'daily' | 'weekly' | 'monthly';
}

export class ClientsQueryDto {
  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}