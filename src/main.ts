import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. PROPER CORS FIX: Is men saare domains open kar diye hain testing k liye
  app.enableCors({
    origin: true, // 'true' karne se har incoming domain (Vercel frontend, local) auto-allow ho jata hy
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // 2. Global Prefix lagayein kyunki aap `/api/orders` hit kar rhe ho
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3002;
  await app.listen(port);
}
bootstrap();