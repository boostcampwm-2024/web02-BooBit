import { Controller, Get } from '@nestjs/common';
import { TradeService } from './trade.service';

@Controller()
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get()
  getHello(): string {
    return this.tradeService.getHello();
  }
}
