import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/entities/order.entity'; // path adjust karo
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly ordersService: OrdersService, // getDressCodeBalance ke liye reuse
  ) {}

  private getDateRanges() {
    const now = new Date();

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const day = now.getDay(); // 0 = Sunday
    const diffToMonday = day === 0 ? 6 : day - 1;
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - diffToMonday);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return { todayStart, todayEnd, weekStart, monthStart };
  }

  // order ka revenue amount nikalne ka safe helper
  // totalAmount na ho to balanceDue + amountReceived se nikal lo
  private getOrderAmount(order: any): number {
    if (order.totalAmount !== undefined && order.totalAmount !== null) {
      return Number(order.totalAmount);
    }
    return (Number(order.amountReceived) || 0) + (Number(order.balanceDue) || 0);
  }

  async getStats(branchId?: string) {
    const { todayStart, todayEnd, weekStart, monthStart } = this.getDateRanges();
    const baseWhere: any = branchId ? { branchId } : {};

    // Saare orders ek hi baar utha lete hain (revenue amount ke liye field flexible hai isliye aggregate nahi, in-memory sum)
    const orders = await this.orderModel.find(baseWhere).lean().exec();

    let totalOrders = 0,
      pendingOrders = 0,
      readyOrders = 0,
      deliveredOrders = 0,
      dailyOrders = 0,
      weeklyOrders = 0,
      monthlyOrders = 0,
      todayRevenue = 0,
      weeklyRevenue = 0,
      monthlyRevenue = 0;

    for (const order of orders) {
      totalOrders++;

      const status = (order.status || '').toString().toLowerCase();
      if (status === 'pending') pendingOrders++;
      if (status === 'ready') readyOrders++;
      if (status === 'delivered') deliveredOrders++;

      const created = new Date((order as any).createdAt);
      const amount = this.getOrderAmount(order);

      if (created >= todayStart && created < todayEnd) {
        dailyOrders++;
        todayRevenue += amount;
      }
      if (created >= weekStart) {
        weeklyOrders++;
        weeklyRevenue += amount;
      }
      if (created >= monthStart) {
        monthlyOrders++;
        monthlyRevenue += amount;
      }
    }

    return {
      totalOrders,
      pendingOrders,
      readyOrders,
      deliveredOrders,
      dailyOrders,
      weeklyOrders,
      monthlyOrders,
      todayRevenue,
      weeklyRevenue,
      monthlyRevenue,
    };
  }

  // Orders ko dressCode ke basis par group karke client list banata hai
  async getClients(branchId?: string) {
    const baseWhere: any = branchId ? { branchId } : {};
    const orders = await this.orderModel.find(baseWhere).sort({ createdAt: -1 }).lean().exec();

    const clientMap = new Map<string, any>();

    for (const order of orders) {
      const key = (order as any).dressCode;
      if (!key) continue; // sirf wo orders jinka dressCode set hai, client bante hain

      if (!clientMap.has(key)) {
        clientMap.set(key, {
          dressCode: key,
          customerName: (order as any).customerName || 'N/A',
          customerPhone: (order as any).customerPhone || 'N/A',
          totalOrders: 0,
          pendingOrders: 0,
          readyOrders: 0,
          deliveredOrders: 0,
          totalRevenue: 0,
          totalDue: 0,
          lastOrderDate: (order as any).createdAt,
        });
      }

      const client = clientMap.get(key);
      client.totalOrders += 1;
      client.totalRevenue += this.getOrderAmount(order);
      client.totalDue += Number((order as any).balanceDue) || 0;

      const status = ((order as any).status || '').toString().toLowerCase();
      if (status === 'pending') client.pendingOrders += 1;
      if (status === 'ready') client.readyOrders += 1;
      if (status === 'delivered') client.deliveredOrders += 1;

      if (new Date((order as any).createdAt) > new Date(client.lastOrderDate)) {
        client.lastOrderDate = (order as any).createdAt;
      }
    }

    return Array.from(clientMap.values()).sort(
      (a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime(),
    );
  }

  // Ek client (dressCode) ka poora detail - orders + balance dono
  async getClientDetail(dressCode: string, branchId?: string) {
    const where: any = { dressCode };
    if (branchId) where.branchId = branchId;

    const orders = await this.orderModel.find(where).sort({ createdAt: -1 }).lean().exec();

    if (!orders || orders.length === 0) {
      throw new NotFoundException(`No orders found for dress code ${dressCode}`);
    }

    let totalOrders = 0,
      pendingOrders = 0,
      readyOrders = 0,
      deliveredOrders = 0,
      totalRevenue = 0;

    for (const order of orders) {
      totalOrders++;
      totalRevenue += this.getOrderAmount(order);

      const status = ((order as any).status || '').toString().toLowerCase();
      if (status === 'pending') pendingOrders++;
      if (status === 'ready') readyOrders++;
      if (status === 'delivered') deliveredOrders++;
    }

    // Aapki existing balance/due calculation reuse ki
    const balance = await this.ordersService.getDressCodeBalance(dressCode);

    return {
      dressCode,
      customerName: (orders[0] as any).customerName || 'N/A',
      customerPhone: (orders[0] as any).customerPhone || 'N/A',
      totalOrders,
      pendingOrders,
      readyOrders,
      deliveredOrders,
      totalRevenue,
      totalDue: balance.totalDue,
      totalAdvance: balance.totalAdvance,
      orders,
    };
  }
}