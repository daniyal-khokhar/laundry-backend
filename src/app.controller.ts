import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Decent Laundry Backend is running perfectly!';
  }

  // Favicon ka 404 error khatam karne ke liye
  @Get('favicon.ico')
  @HttpCode(204)
  getFavicon() {
    return;
  }
}