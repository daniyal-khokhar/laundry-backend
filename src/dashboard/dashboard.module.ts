import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { OrdersModule } from '../orders/orders.module'; // path apne project ke hisab se adjust karo
import { Order, OrderSchema } from '../orders/entities/order.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    OrdersModule], // OrdersService (getDressCodeBalance) reuse karne ke liye
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}