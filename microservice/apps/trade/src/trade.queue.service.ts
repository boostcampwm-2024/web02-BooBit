import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TradeRequestListDto } from '@app/grpc/dto/trade.request.list.dto';

@Injectable()
export class TradeQueueService {
  constructor(@InjectQueue('balance') private queue: Queue) {}

  async addQueue(trade: TradeRequestListDto) {
    await this.queue.add('TRADE-BALANCE', { trade });
  }
}
