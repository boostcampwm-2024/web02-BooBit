import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class TransactionQueueService {
  constructor(@InjectQueue('trade') private queue: Queue) {}

  async addQueue(name: string, historyId: string) {
    await this.queue.add(name, { historyId: historyId }, { jobId: `${name}-${historyId}` });
  }
}
