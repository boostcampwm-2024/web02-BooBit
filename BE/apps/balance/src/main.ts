import { NestFactory } from '@nestjs/core';
import { BalanceModule } from './balance.module';
import { PrismaService } from './databases/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(BalanceModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks();

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
