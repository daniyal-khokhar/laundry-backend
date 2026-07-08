import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS for Frontend Connectivity
  app.enableCors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. Global Prefix (Optional: Agar aapne pehle use kiya ho to text ko /api banata hy, warna ignore)
  // app.setGlobalPrefix('api');

  // 3. Vercel dynamic port allocation handle karne k liye
  const port = process.env.PORT || 3002;
  await app.listen(port);
}

// ⚠️ Vercel serverless environment k liye initialization call zaroori hy
bootstrap();