import { Controller, Get } from '@nestjs/common';

@Controller() // Isko khali chorna hai taake yeh '/' par listen kare
export class AppController {
  @Get() // Isko bhi khali chorna hai
  getHello(): string {
    return 'Decent Laundry Backend is running successfully!';
  }
}