import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth.module';
import cors from '@app/common/cors';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.useGlobalPipes(new ValidationPipe());

  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  app.enableCors(cors);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
