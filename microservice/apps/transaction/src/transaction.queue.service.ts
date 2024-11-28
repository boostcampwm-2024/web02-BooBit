import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OrderType } from '@app/common/enums/order-type.enum';
import { TradeOrder } from '@app/grpc/dto/trade.order.dto';

@Injectable()
export class TransactionQueueService {
  constructor(@InjectQueue('trade') private queue: Queue) {}

  async addQueue(name: string, trade: TradeOrder) {
    await this.queue.add(name, { trade }, { jobId: `${name}-${trade.historyId}` });
  }

  async addCancelQueue(userId: bigint, historyId: string, orderType: OrderType) {
    await this.queue.add(
      OrderType.CANCELED,
      { userId, historyId, orderType },
      { jobId: `${OrderType.CANCELED}-${historyId}` },
    );
  }
}
