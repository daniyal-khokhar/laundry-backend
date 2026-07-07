import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  // DONO GET METHODS KO MERGE KAR DIYA: Agar query mein branchId ho toh branch wale aayein, nahi toh saare
  @Get()
  async findAll(@Query('branchId') branchId?: string) {
    try {
      if (branchId) {
        console.log(`Controller: Fetching orders for branch: ${branchId}`);
        const orders = await this.ordersService.getOrdersByBranch(branchId);
        return {
          success: true,
          message: `Orders for branch ${branchId} fetched successfully.`,
          data: orders,
        };
      }
      
      const allOrders = await this.ordersService.findAll();
      return {
        success: true,
        data: allOrders,
      };
    } catch (error: any) {
      throw new HttpException({
        success: false,
        message: error.message || 'Internal Server Error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id); // '+' hata diya, ab string pass ho rahi hy
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto); // '+' hata diya
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id); // '+' hata diya
  }
}