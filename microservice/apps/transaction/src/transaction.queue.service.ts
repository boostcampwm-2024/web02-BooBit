import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OrderType } from '@app/common/enums/order-type.enum';

@Injectable()
export class TransactionQueueService {
  constructor(@InjectQueue('trade') private queue: Queue) {}

  async addQueue(name: string, historyId: string) {
    await this.queue.add(name, { historyId: historyId }, { jobId: `${name}-${historyId}` });
  }

  async addCancelQueue(userId: bigint, historyId: string, orderType: OrderType) {
    await this.queue.add(
      OrderType.CANCELED,
      { userId, historyId, orderType },
      { jobId: `${OrderType.CANCELED}-${historyId}` },
    );
  }
}
