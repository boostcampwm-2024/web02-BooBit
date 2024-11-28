import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { OrderType } from '@app/common/enums/order-type.enum';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { TradeService } from './trade.service';

@Processor('trade', { concurrency: 1 })
export class TradeProcessor extends WorkerHost {
  private readonly logger = new Logger(TradeProcessor.name);

  constructor(private tradeService: TradeService) {
    super();
  }

  async process(job: Job<any>): Promise<void> {
    this.logger.log(`Processing job: ${job.id}`);

    switch (job.name) {
      case OrderType.BUY:
        await this.tradeService.processTrade(job.name, job.data);
        break;

      case OrderType.SELL:
        await this.tradeService.processTrade(job.name, job.data);
        break;

      case OrderType.CANCELED:
        const { userId, historyId, orderType } = job.data;
        await this.tradeService.cancelOrder(userId, historyId, orderType);
        break;

      default:
        this.logger.error(`Unknown job type: ${job.name}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job completed: ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job failed: ${job.id}`, error);
  }
}
