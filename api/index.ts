import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

export const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  
  app.enableCors(); // CORS enable rakhein taake frontend block na ho
  
  // 🟢 YEH LINE ADD KAREIN: is se NestJS ko pata chalega ke har route se pehle /api aayega
  app.setGlobalPrefix('api'); 
  
  await app.init();
};

export default async (req: any, res: any) => {
  await createNestServer(server);
  server(req, res);
};