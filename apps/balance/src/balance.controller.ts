import { Body, Controller, Get, Post } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateTransactionDto {
  currency_code: string;
  amount: Decimal;
}

@Controller('api/users')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/assets')
  async getAssets() {
    const userId = 1;
    const assets = await this.balanceService.getAssets(userId);
    return { assets };
  }

  @Post('/deposit')
  async deposit(@Body() createTransactionDto: CreateTransactionDto) {
    const userId = 1n;
    const assets = await this.balanceService.deposit(userId, createTransactionDto);
    return { assets };
  }

  @Post('/withdraw')
  async withdraw(@Body() createTransactionDto: CreateTransactionDto) {
    const userId = 1n;
    const assets = await this.balanceService.withdraw(userId, createTransactionDto);
    return { assets };
  }
}
