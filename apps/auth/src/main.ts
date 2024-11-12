import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createSessionConfig } from '@app/common/session/session-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const { session, passportInitialize, passportSession } = await createSessionConfig();
  app.use(session);
  app.use(passportInitialize);
  app.use(passportSession);

  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
