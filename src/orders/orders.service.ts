import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './entities/order.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    console.log('📝 DTO received:', JSON.stringify(createOrderDto, null, 2));
    
    // ✅ Default status set karein
    if (!createOrderDto.status) {
      createOrderDto.status = OrderStatus.PENDING;
    }
    
    console.log('✅ Status set to:', createOrderDto.status);
    
    const newOrder = new this.orderModel(createOrderDto);
    const savedOrder = await newOrder.save();
    
    console.log('💾 Saved order (raw):', JSON.stringify(savedOrder, null, 2));
    console.log('📌 Status in saved order:', savedOrder.status);
    
    // ✅ Forcefully fetch the saved document to ensure all fields
    const populatedOrder = await this.orderModel.findById(savedOrder._id).lean().exec();
    console.log('📌 Populated order status:', populatedOrder?.status);
    
    return populatedOrder as Order;
  }

  async findAll(filter: any = {}): Promise<Order[]> {
    console.log('🔍 Finding orders with filter:', filter);
    const orders = await this.orderModel.find(filter).lean().exec();
    console.log(`📤 Found ${orders.length} orders`);
    if (orders.length > 0) {
      console.log('📌 First order status:', orders[0].status);
    }
    return orders;
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).lean().exec();
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    console.log('📌 Order status:', order.status);
    return order;
  }

  async getOrdersByBranch(branchId: string): Promise<Order[]> {
    console.log(`📂 Fetching orders for branch: ${branchId}`);
    const orders = await this.orderModel.find({ branchId }).lean().exec();
    if (!orders || orders.length === 0) {
      throw new NotFoundException(`No orders found for Branch ID: ${branchId}`);
    }
    return orders;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    console.log(`🔄 Updating order ${id} status to: ${status}`);
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(
        id, 
        { status }, 
        { new: true }
      )
      .lean()
      .exec();
      
    if (!updatedOrder) throw new NotFoundException(`Order #${id} not found`);
    console.log('✅ Updated order status:', updatedOrder.status);
    return updatedOrder;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .lean()
      .exec();
    if (!updatedOrder) throw new NotFoundException(`Order #${id} not found`);
    return updatedOrder;
  }

  async remove(id: string) {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deletedOrder) throw new NotFoundException(`Order #${id} not found`);
    return { message: `Order #${id} successfully removed` };
  }
}