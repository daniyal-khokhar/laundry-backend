import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // CORS Configuration with safe fallback
    const corsOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean)
      : ['http://localhost:5173', 'http://localhost:3000']; // Apni frontend ports yahan set rakhein

    app.enableCors({
      origin: corsOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    // Global Prefix set kiya hai, yani har URL 'api' se shuru hoga
    app.setGlobalPrefix('api');

    // CORS enable karna lazmi hai taake aapka Next.js frontend isko access kar sake
    app.enableCors();

    // Agar .env mein port nahi hai to default 3002 par chalega
    const port = parseInt(process.env.PORT || '3002', 10);
    
    await app.listen(port, '0.0.0.0'); // Sahi NestJS listen method
    
    logger.log(`✅ Backend running on: http://localhost:${port}`);
    logger.log(`✅ CORS enabled for: ${corsOrigins.join(', ')}`);
    
  } catch (error) {
    Logger.error('Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();