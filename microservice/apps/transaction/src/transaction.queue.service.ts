import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TradeRequestDto } from './dto/trade.request.dto';

@Injectable()
export class TransactionQueueService {
  constructor(@InjectQueue('trade') private queue: Queue) {}

  async addQueue(name: string, tradeRequest: TradeRequestDto) {
    await this.queue.add(
      name,
      {
        historyId: tradeRequest.historyId,
        userId: tradeRequest.userId,
        coinCode: tradeRequest.coinCode,
        price: tradeRequest.price,
        amount: tradeRequest.amount,
      },
      {
        jobId: tradeRequest.historyId,
      },
    );
  }
}
