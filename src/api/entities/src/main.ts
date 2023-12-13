import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodExceptionFilter } from './middlewares/zod-exception.filter';

import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  app.useGlobalFilters(new ZodExceptionFilter());

  await app.listen(process.env.API_ENTITIES_PORT);
}

bootstrap();