import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction.module';
import { ValidationPipe } from '@nestjs/common';
import { createSessionConfig } from '@app/common/session/session-middleware';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);
  app.useGlobalPipes(new ValidationPipe());
  const { session, passportInitialize, passportSession } = await createSessionConfig();
  app.use(session);
  app.use(passportInitialize);
  app.use(passportSession);

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
