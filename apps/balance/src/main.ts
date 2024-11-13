import { NestFactory } from '@nestjs/core';
import { BalanceModule } from './balance.module';
import { PrismaService } from '@app/prisma';
import cors from '@app/common/cors';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(BalanceModule);
  const prismaService = app.get(PrismaService);

  await prismaService.enableShutdownHooks();
  app.enableCors(cors);
  await app.listen(3000, '0.0.0.0');

  const grpcApp = await NestFactory.createMicroservice(BalanceModule, {
    transport: Transport.GRPC,
    options: {
      package: 'order',
      protoPath: '@app/grpc/order.proto',
      url: '0.0.0.0:5001',
    },
  });
  await grpcApp.listen();
}
bootstrap();
