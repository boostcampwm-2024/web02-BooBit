import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction.module';
import { ValidationPipe } from '@nestjs/common';
import cors from '@app/common/cors';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors(cors);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
