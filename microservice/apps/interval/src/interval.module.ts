import { Module } from '@nestjs/common';
import { IntervalService } from './interval.service';
import { ScheduleModule } from '@nestjs/schedule';
import { IntervalMakeService } from './interval.make.service';
import { IntervalRepository } from './interval.candle.repository';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [IntervalService, IntervalMakeService, IntervalRepository],
})
export class IntervalModule {}
