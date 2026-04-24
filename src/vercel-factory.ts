import 'reflect-metadata';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import type { Request, Response } from 'express';
import express from 'express';
import serverless from 'serverless-http';
import { applyHttpGlobals } from './app-http.setup';
import { AppModule } from './app.module';

type ServerlessHandler = (req: Request, res: Response) => void;

let cached: ServerlessHandler | null = null;

/**
 * Inicializa Nest sobre Express y devuelve un handler estilo API Gateway
 * reutilizable entre invocaciones (importante en serverless / Vercel).
 */
export async function getVercelHandler(): Promise<ServerlessHandler> {
  if (cached) {
    return cached;
  }
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  applyHttpGlobals(app);
  await app.init();
  cached = serverless(expressApp) as ServerlessHandler;
  return cached;
}
