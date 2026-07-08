import { Module, Controller, Get } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';

// 1. Ek chota sa controller yahi bana lete hain root path k liye
@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Decent Laundry Backend is running successfully with MongoDB!';
  }
}

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CON_STRING || 'mongodb://127.0.0.1:27017/decent-laundry'),
    OrdersModule,
  ],
  controllers: [AppController], // 2. Is controller ko yahan register kar diya
})
export class AppModule {}