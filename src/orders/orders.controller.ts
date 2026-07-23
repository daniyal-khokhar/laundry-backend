// orders.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '../enums/order-status.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    console.log('📝 Create Order DTO:', JSON.stringify(createOrderDto, null, 2));
    const order = await this.ordersService.create(createOrderDto);
    return {
      success: true,
      data: order,
      message: 'Order created successfully'
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus
  ) {
    const order = await this.ordersService.updateStatus(id, status);
    return {
      success: true,
      data: order,
      message: `Order status updated to ${status}`
    };
  }

  @Get()
  async findAll(@Query('status') status?: OrderStatus) {
    try {
      const query: any = {};
      if (status) query.status = status;
      
      const orders = await this.ordersService.findAll(query);
      
      return {
        success: true,
        data: orders,
        count: orders.length
      };
    } catch (error: any) {
      throw new HttpException({
        success: false,
        message: error.message || 'Internal Server Error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    return {
      success: true,
      data: order
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    console.log(`🔄 UPDATE REQUEST for ID: ${id}`);
    console.log('📦 Update DTO received:', JSON.stringify(updateOrderDto, null, 2));
    
    const updatedOrder = await this.ordersService.update(id, updateOrderDto);
    
    console.log('✅ Updated Order result:', JSON.stringify(updatedOrder, null, 2));
    
    return {
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}