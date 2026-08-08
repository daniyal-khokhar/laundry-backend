import { Controller, Get, Param, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // Stats cards: total, pending, ready, delivered + daily/weekly/monthly revenue
  @Get('stats')
  async getStats(@Query('branchId') branchId?: string) {
    const data = await this.dashboardService.getStats(branchId);
    return { success: true, data };
  }

  // Grouped client list - one card per client (grouped by dressCode)
  @Get('clients')
  async getClients(@Query('branchId') branchId?: string) {
    const data = await this.dashboardService.getClients(branchId);
    return { success: true, data, count: data.length };
  }

  // Single client's full detail (used on click) - dressCode se
  @Get('clients/:dressCode')
  async getClientDetail(
    @Param('dressCode') dressCode: string,
    @Query('branchId') branchId?: string,
  ) {
    const data = await this.dashboardService.getClientDetail(dressCode, branchId);
    return { success: true, data };
  }
}