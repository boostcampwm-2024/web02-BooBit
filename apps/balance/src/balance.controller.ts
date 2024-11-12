import { Controller, Get } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('api/users')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/assets')
  async getAssets() {
    const userId = BigInt(1);
    const assets = await this.balanceService.getAssets(userId);
    return { assets };
  }
}
