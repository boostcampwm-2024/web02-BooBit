import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreateTransactionDto } from './balance.controller';
import { Prisma } from '@prisma/client';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

@Injectable()
export class BalanceRepository {
  constructor(private prisma: PrismaService) {}
  async deposit(userId: string, createTransactionDto: CreateTransactionDto) {
    const { currency_code, amount } = createTransactionDto;
    return await this.prisma.$transaction(async (prisma) => {
      const asset = prisma.asset.upsert({
        where: {
          user_id_currency_code: {
            user_id: userId,
            currency_code,
          },
        },
        create: {
          user_id: userId,
          currency_code,
          available_balance: new Prisma.Decimal(amount),
          locked_balance: new Prisma.Decimal(0),
        },
        update: {
          available_balance: {
            increment: amount,
          },
        },
      });

      const depositTransaction = prisma.depositWithdrawal.create({
        data: {
          user_id: userId,
          currency_code,
          tx_type: TransactionType.DEPOSIT,
          amount: new Prisma.Decimal(amount),
        },
      });

      const [assetResult, depositTransactionResult] = await Promise.all([
        asset,
        depositTransaction,
      ]);

      return {
        depositTransactionResult,
        newBalance: assetResult.available_balance,
      };
    });
  }

  async withdraw(userId: string, createTransactionDto: CreateTransactionDto) {
    return this.prisma.$transaction(async (prisma) => {
      const { currency_code, amount } = createTransactionDto;

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

      const updatedAsset = prisma.asset.update({
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

      const makeHistory = prisma.depositWithdrawal.create({
        data: {
          user_id: userId,
          currency_code,
          tx_type: TransactionType.WITHDRAWAL,
          amount: new Prisma.Decimal(amount),
        },
      });

      const [updatedAssetResult, makeHistoryResult] = await Promise.all([
        updatedAsset,
        makeHistory,
      ]);

      return {
        makeHistoryResult,
        newBalance: updatedAssetResult.available_balance,
      };
    });
  }

  async getAssets(userId: number): Promise<asset[]> {
    return await this.txHost.tx.asset.findMany({
      select: {
        currency_code: true,
        available_balance: true,
        locked_balance: true,
        currency: {
          select: {
            name: true,
          },
        },
      },
      where: { user_id: userId },
    });
  }
}
