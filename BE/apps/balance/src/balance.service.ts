import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './balance.controller';
import { PrismaService } from '@app/prisma';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL'
}

@Injectable()
export class BalanceService {
  constructor(private prisma: PrismaService) {}
  
  async deposit(userId: string, createTransactionDto: CreateTransactionDto) {
    const { currency_code, amount } = createTransactionDto;

    if (amount <= new Decimal(0)) {
      throw new BadRequestException('Deposit amount must be greater than 0');
    }

    return this.prisma.$transaction(async (prisma) => {
      const asset = await prisma.asset.upsert({
        where: { 
          user_id_currency_code: {
            user_id: userId,
            currency_code,
          },
        },
        create: {
          user_id: userId,
          currency_code,
          available_balance: new Decimal(amount),
          locked_balance: new Decimal(0),
        },
        update: {
          available_balance: {
            increment: amount,
          },
        },
      });

      const depositTransaction = await prisma.depositWithdrawal.create({
        data: {
          user_id: userId,
          currency_code,
          tx_type: TransactionType.DEPOSIT,
          amount: new Decimal(amount),
        },
      });

      return {
        depositTransaction,
        newBalance: asset.available_balance,
      };
    });
  }

  async withdraw(userId: string, createTransactionDto: CreateTransactionDto) {
    const { currency_code, amount } = createTransactionDto;

    if (amount <= new Decimal(0)) {
      throw new BadRequestException('Withdrawal amount must be greater than 0');
    }

    return this.prisma.$transaction(async (prisma) => {
      const asset = await prisma.asset.findUnique({
        where: {
          user_id_currency_code: {
            user_id: userId,
            currency_code,
          },
        },
      });

      if (!asset || asset.available_balance.lessThan(amount)) {
        throw new BadRequestException('잔액 불충분');
      }

      const updatedAsset = await prisma.asset.update({
        where: {
          user_id_currency_code: {
            user_id: userId,
            currency_code,
          },
        },
        data: {
          available_balance: {
            decrement: amount,
          },
        },
      });

      const transaction = await prisma.depositWithdrawal.create({
        data: {
          user_id: userId,
          currency_code,
          tx_type: TransactionType.WITHDRAWAL,
          amount: new Decimal(amount),
        },
      });

      return {
        transaction,
        newBalance: updatedAsset.available_balance,
      };
    });
  }
}
