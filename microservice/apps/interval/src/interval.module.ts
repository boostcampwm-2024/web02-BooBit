import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IntervalService } from './interval.service';
import { IntervalMakeService } from './interval.make.service';
import { IntervalRepository } from './interval.candle.repository';
import { PrismaModule } from '@app/prisma';
import { Redis } from 'ioredis';
import { IntervalOrderBookService } from './interval.order.book.service';
import { IntervalOrderBookRepository } from './interval.order.book.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    IntervalService,
    IntervalMakeService,
    IntervalRepository,
    IntervalOrderBookService,
    IntervalOrderBookRepository,
    {
      provide: 'REDIS_PUBLISHER',
      useFactory: (configService: ConfigService) => {
        const redis = new Redis(configService.get('TRADE_REDIS_URL'), {
          maxRetriesPerRequest: null,
        });

        redis.on('error', (err) => {
          console.error('Redis connection error:', err);
        });

        return redis;
      },
      inject: [ConfigService],
    },
  ],
})
export class IntervalModule {}
