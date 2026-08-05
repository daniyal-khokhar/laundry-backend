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

  /**
   * Total outstanding balance for a dress code = SUM of balanceDue
   * across all its records (minus any advanceCredit sitting on them).
   * This is what you show as "Total Due" for that customer/dress code.
   */
  async getDressCodeBalance(dressCode: string) {
    const orders = await this.orderModel
      .find({ dressCode })
      .sort({ createdAt: 1 }) // oldest first
      .lean()
      .exec();

    const totalDue = orders.reduce(
      (sum, o) => sum + (Number(o.balanceDue) || 0) - (Number(o.advanceCredit) || 0),
      0
    );

    return {
      dressCode,
      totalDue: Math.max(0, totalDue),
      totalAdvance: totalDue < 0 ? Math.abs(totalDue) : 0,
      recordCount: orders.length,
      records: orders.map((o) => ({
        id: o._id,
        createdAt: (o as any).createdAt,
        balanceDue: o.balanceDue || 0,
        advanceCredit: o.advanceCredit || 0,
        paymentStatus: o.paymentStatus,
      })),
    };
  }

  /**
   * FIFO payment allocation.
   * Payment sabse purani (oldest) unpaid record se start hoke,
   * ek-ek karke records ka balanceDue clear karta hai.
   * Agar amount se zyada records clear ho jayein to extra amount
   * sabse aakhri touched record par advanceCredit ban jata hai.
   */
  async applyPaymentToDressCode(
    dressCode: string,
    amount: number,
    paymentMethod: string
  ) {
    if (amount <= 0) {
      throw new NotFoundException('Payment amount must be greater than 0');
    }

    // Sirf wo records jinka abhi due baaki hai, oldest -> newest
    const dueOrders = await this.orderModel
      .find({ dressCode, balanceDue: { $gt: 0 } })
      .sort({ createdAt: 1 })
      .exec();

    if (dueOrders.length === 0) {
      throw new NotFoundException(
        `No outstanding due records found for dress code ${dressCode}`
      );
    }

    let remaining = amount;
    const updatedRecords: any[] = [];

    for (const order of dueOrders) {
      if (remaining <= 0) break;

      const currentDue = Number(order.balanceDue) || 0;
      const currentReceived = Number(order.amountReceived) || 0;

      if (currentDue <= remaining) {
        // Ye record poora clear ho jayega
        remaining -= currentDue;
        order.balanceDue = 0;
        order.advanceCredit = 0;
        order.amountReceived = currentReceived + currentDue;
        order.paymentStatus = 'paid';
      } else {
        // Ye record partial clear hoga, payment yahin khatam
        order.balanceDue = currentDue - remaining;
        order.amountReceived = currentReceived + remaining;
        order.paymentStatus = 'partial';
        remaining = 0;
      }

      order.paymentMethod = paymentMethod as any;
      await order.save();
      updatedRecords.push({
        id: order._id,
        balanceDue: order.balanceDue,
        paymentStatus: order.paymentStatus,
      });
    }

    // Agar payment total due se zyada thi -> baqi amount advance ban jaye
    // sabse aakhri (latest) touched record par
    if (remaining > 0 && updatedRecords.length > 0) {
      const lastTouchedId = updatedRecords[updatedRecords.length - 1].id;
      const lastOrder = await this.orderModel.findById(lastTouchedId).exec();
      if (lastOrder) {
        lastOrder.advanceCredit = (Number(lastOrder.advanceCredit) || 0) + remaining;
        await lastOrder.save();
        updatedRecords[updatedRecords.length - 1].advanceCredit = lastOrder.advanceCredit;
        remaining = 0;
      }
    }

    const newBalance = await this.getDressCodeBalance(dressCode);

    return {
      dressCode,
      amountApplied: amount,
      unallocatedAmount: remaining, // hamesha 0 hona chahiye
      updatedRecords,
      newBalance,
    };
  }
}
