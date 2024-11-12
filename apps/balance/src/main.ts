import { NestFactory } from '@nestjs/core';
import { BalanceModule } from './balance.module';
import { PrismaService } from '@app/prisma';
import { createSessionConfig } from '@app/common/session/session-middleware';
async function bootstrap() {
  const app = await NestFactory.create(BalanceModule);
  const prismaService = app.get(PrismaService);

  const { session, passportInitialize, passportSession } = await createSessionConfig();
  app.use(session);
  app.use(passportInitialize);
  app.use(passportSession);

  await prismaService.enableShutdownHooks();
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
