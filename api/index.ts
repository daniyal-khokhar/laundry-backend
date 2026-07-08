import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express = require('express');
import { AppModule } from '../src/app.module';

const server = express();

export const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  
  // Agar cors chahiye to:
  app.enableCors();
  
  await app.init();
};

export default async (req: any, res: any) => {
  await createNestServer(server);
  server(req, res);
};