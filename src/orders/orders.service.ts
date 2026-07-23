// orders.service.ts
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
    
    if (!createOrderDto.status) {
      createOrderDto.status = OrderStatus.PENDING;
    }
    
    const newOrder = new this.orderModel(createOrderDto);
    const savedOrder = await newOrder.save();
    
    console.log('💾 Saved order ID:', savedOrder._id);
    
    const populatedOrder = await this.orderModel.findById(savedOrder._id).lean().exec();
    console.log('📌 Created order:', JSON.stringify(populatedOrder, null, 2));
    
    return populatedOrder as Order;
  }

  async findAll(filter: any = {}): Promise<Order[]> {
    console.log('🔍 Finding orders with filter:', filter);
    const orders = await this.orderModel.find(filter).lean().exec();
    console.log(`📤 Found ${orders.length} orders`);
    return orders;
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).lean().exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    console.log('📌 Found order:', JSON.stringify(order, null, 2));
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
        { new: true, runValidators: true }
      )
      .lean()
      .exec();
      
    if (!updatedOrder) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    console.log('✅ Updated order status:', updatedOrder.status);
    return updatedOrder;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    console.log(`🔄 Updating order ${id}`);
    console.log('📦 Update Data:', JSON.stringify(updateOrderDto, null, 2));
    
    // ✅ Remove undefined values to avoid overwriting with undefined
    const updateData = Object.fromEntries(
      Object.entries(updateOrderDto).filter(([_, value]) => value !== undefined)
    );
    
    console.log('📦 Cleaned Update Data:', JSON.stringify(updateData, null, 2));
    
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(
        id, 
        { $set: updateData }, // ✅ Use $set to explicitly update only provided fields
        { 
          new: true,          // Return the updated document
          runValidators: true // Run validation on update
        }
      )
      .lean()
      .exec();
      
    if (!updatedOrder) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    
    console.log('✅ Updated Order:', JSON.stringify(updatedOrder, null, 2));
    return updatedOrder;
  }

  async remove(id: string) {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deletedOrder) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return { message: `Order #${id} successfully removed` };
  }
}