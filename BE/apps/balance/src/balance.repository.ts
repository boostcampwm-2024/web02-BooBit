import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { asset } from './dto/asset.type';

@Injectable()
export class BalanceRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

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
