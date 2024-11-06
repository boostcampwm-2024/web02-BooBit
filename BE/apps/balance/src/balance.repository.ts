import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BalanceRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}
}
