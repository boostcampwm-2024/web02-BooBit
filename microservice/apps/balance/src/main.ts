import { NestFactory } from '@nestjs/core';
import { BalanceModule } from './balance.module';
import { PrismaService } from '@app/prisma';
import cors from '@app/common/cors';

async function bootstrap() {
  const app = await NestFactory.create(BalanceModule);
  const prismaService = app.get(PrismaService);

  await prismaService.enableShutdownHooks();
  app.enableCors(cors);
  await app.listen(3000, '0.0.0.0');

  const grpcApp = await NestFactory.createMicroservice(BalanceModule, BalanceModule.grpcOptions);
  await grpcApp.listen();
}
bootstrap();
