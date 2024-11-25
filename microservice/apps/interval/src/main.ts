import { NestFactory } from '@nestjs/core';
import { IntervalModule } from './interval.module';

async function bootstrap() {
  const app = await NestFactory.create(IntervalModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
