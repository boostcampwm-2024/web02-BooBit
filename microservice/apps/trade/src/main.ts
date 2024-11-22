import { NestFactory } from '@nestjs/core';
import { TradeModule } from './trade.module';

async function bootstrap() {
  const app = await NestFactory.create(TradeModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
