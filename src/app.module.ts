import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // FIX: Yeh directly aapki .env file se connection string uthaye ga
    MongooseModule.forRoot(process.env.MONGO_CON_STRING || 'mongodb://127.0.0.1:27017/decent-laundry'),
    OrdersModule,
  ],
})
export class AppModule {}