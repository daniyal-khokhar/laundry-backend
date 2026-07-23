import { IsEnum, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { OrderStatus } from '../../enums/order-status.enum';

// ✅ REBUILT: dedicated, self-contained DTO used ONLY by
// PATCH /orders/:id/status. Nothing inherited from CreateOrderDto —
// keeps this endpoint simple and independent.
export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status!: OrderStatus;

  // Stamped when "Send to Laundry" is clicked (status -> processing)
  @IsDateString()
  @IsOptional()
  sendingDate?: string;

  // Stamped when "Received from Laundry" is clicked (status -> ready)
  @IsDateString()
  @IsOptional()
  receivingDate?: string;
}