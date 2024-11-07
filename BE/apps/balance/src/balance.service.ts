import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './balance.controller';
import { Decimal } from '@prisma/client/runtime/library';
import { BalanceRepository } from './balance.repository';

@Injectable()
export class BalanceService {
  constructor(private balanceRepository: BalanceRepository) {}

  async deposit(userId: string, createTransactionDto: CreateTransactionDto) {
    const { amount } = createTransactionDto;

    if (amount <= new Decimal(0)) {
      throw new BadRequestException('Deposit amount must be greater than 0');
    }

    return await this.balanceRepository.deposit(userId, createTransactionDto);
  }

  async withdraw(userId: string, createTransactionDto: CreateTransactionDto) {
    const { amount } = createTransactionDto;

    if (amount <= new Decimal(0)) {
      throw new BadRequestException('Withdrawal amount must be greater than 0');
    }

    return await this.balanceRepository.withdraw(userId, createTransactionDto);
  }
}
