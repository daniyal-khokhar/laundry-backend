import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './entities/order.entity';


@Injectable()
export class OrdersService {
  // 1. Yahan MongoDB ka Model inject kiya hy
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  // 2. Data save karne ka real method
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    console.log('Service: Saving new order to MongoDB');
    const newOrder = new this.orderModel(createOrderDto);
    return await newOrder.save();
  }

  async findAll() {
    return await this.orderModel.find().exec();
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  // 3. Branch ID se data filter karne ka real method
  async getOrdersByBranch(branchId: string): Promise<Order[]> {
    try {
      console.log(`Service: Fetching orders from MongoDB for Branch ID: ${branchId}`);
      
      // Database query: branchId match karne wale orders dhoondo
      const filteredOrders = await this.orderModel.find({ branchId }).exec();

      if (!filteredOrders || filteredOrders.length === 0) {
        throw new NotFoundException(`No orders found for Branch ID: ${branchId}`);
      }

      return filteredOrders;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
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