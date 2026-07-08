import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express'; // TypeScript friendly import

const server = express();

// 🟢 NestJS ke chalne se PEHLE hi favicon aur root requests ko handle kar lein
server.get('/favicon.ico', (req, res) => res.status(204).end());
server.get('/favicon.png', (req, res) => res.status(204).end());
server.get('/', (req, res) => res.status(200).send('Decent Laundry Backend is Live!'));

export const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  
  app.enableCors();
  app.setGlobalPrefix('api'); // Frontend ki /api/orders waali requests ke liye
  
  await app.init();
};

export default async (req: any, res: any) => {
  await createNestServer(server);
  server(req, res);
};