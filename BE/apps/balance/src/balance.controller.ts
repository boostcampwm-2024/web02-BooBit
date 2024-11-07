import { Controller } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateTransactionDto {
  currency_code: string;
  amount: Decimal;
}

@Controller()
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}
}
