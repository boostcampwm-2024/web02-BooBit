import { Module } from '@nestjs/common';
import { IntervalService } from './interval.service';
import { ScheduleModule } from '@nestjs/schedule';
import { IntervalMakeService } from './interval.make.service';
import { IntervalRepository } from './interval.candle.repository';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  providers: [IntervalMakeService, IntervalService, IntervalRepository],
})
export class IntervalModule {}
