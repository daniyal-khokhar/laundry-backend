import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './entities/order.entity'; // Path check kar lena

@Module({
  imports: [
    // Model register hona chahiye
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, OrdersModule], // OrdersService ko export karna zaruri hai taaki DashboardModule me use ho sake
})
export class OrdersModule {}