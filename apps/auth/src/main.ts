import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.useGlobalPipes(new ValidationPipe());

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
