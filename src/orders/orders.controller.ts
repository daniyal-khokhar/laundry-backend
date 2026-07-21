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
    console.log('📥 POST /orders - Request body:', JSON.stringify(createOrderDto, null, 2));
    
    // ✅ Default status set karein
    if (!createOrderDto.status) {
      createOrderDto.status = OrderStatus.PENDING;
    }
    
    console.log('📤 Status in DTO:', createOrderDto.status);
    
    const order = await this.ordersService.create(createOrderDto);
    
    console.log('📤 Response order:', JSON.stringify(order, null, 2));
    console.log('📌 Status in response:', order.status);
    
    // ✅ SIRF DATA RETURN KAREIN (NO WRAPPER)
    return order;
  }

  @Get()
  async findAll(@Query('status') status?: OrderStatus) {
    console.log('📥 GET /orders - Status filter:', status);
    
    const query: any = {};
    if (status) query.status = status;
    
    const orders = await this.ordersService.findAll(query);
    
    console.log(`📤 Found ${orders.length} orders`);
    if (orders.length > 0) {
      console.log('📌 First order status:', orders[0].status);
    }
    
    // ✅ SIRF DATA RETURN KAREIN (NO WRAPPER)
    return orders;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    return order;
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus
  ) {
    console.log(`📥 PATCH /orders/${id}/status - New status:`, status);
    const order = await this.ordersService.updateStatus(id, status);
    return order;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const order = await this.ordersService.update(id, updateOrderDto);
    return order;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ordersService.remove(id);
  }
}