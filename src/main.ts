import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS enable karein taake frontend request block na ho
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Prefix lagayein kyunki frontend ko /api chahiye
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3002; // Frontend ke mutabiq 3002 fallback
  await app.listen(port);
}
bootstrap();