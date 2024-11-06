import { Controller, Get } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller()
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  getHello(): string {
    return this.balanceService.getHello();
  }
}
