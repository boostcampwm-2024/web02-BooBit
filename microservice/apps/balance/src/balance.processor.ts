import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { BalanceService } from './balance.service';

@Processor('balance')
export class BalanceProcessor extends WorkerHost {
  private readonly logger = new Logger(BalanceProcessor.name);

  constructor(private balanceService: BalanceService) {
    super();
  }

  async process(job: Job<any>): Promise<void> {
    this.logger.log(`Processing job: ${job.id}`);
    await this.balanceService.settleTransaction(job.data.trade);
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
