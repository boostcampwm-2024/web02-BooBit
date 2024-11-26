import { IntervalRepository } from './interval.candle.repository';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';
import { CandleDataDto } from '@app/ws/dto/candle.data.dto';
import { Injectable, Logger, OnModuleDestroy, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IntervalMakeService } from './interval.make.service';
import { Redis } from 'ioredis';
import { RedisChannel } from '@app/common/enums/redis-channel.enum';
import { IntervalOrderBookService } from './interval.order.book.service';

@Injectable()
export class IntervalService implements OnModuleDestroy {
  private readonly logger = new Logger(IntervalService.name);
  private intervalData: Map<TimeScale, CandleDataDto> = new Map<TimeScale, CandleDataDto>();

  constructor(
    private intervalMakeService: IntervalMakeService,
    private IntervalOrderBookService: IntervalOrderBookService,
    private IntervalRepository: IntervalRepository,
    @Inject('REDIS_PUBLISHER') private readonly redisPublisher: Redis,
  ) {
    Object.entries(TimeScale).forEach(async ([key, value]) => {
      this.logger.log(`${key} : ${value}`);
      this.intervalData.set(
        value,
        new CandleDataDto({
          date: new Date(),
          open: 0,
          close: 0,
          high: 0,
          low: 0,
          volume: 0,
        }),
      );
    });
  }

  async onModuleDestroy() {
    await this.redisPublisher.quit();
  }

  // 매초마다 실행 (* * * * * *)
  @Cron(CronExpression.EVERY_SECOND, { timeZone: 'Asia/Seoul' })
  async everySecond() {
    try {
      const date = new Date();
      date.setMilliseconds(0);

      const { candle, trades } = await this.intervalMakeService.makeSecData(date);
      await this.handleCandleData(date, candle);
      await Promise.all([
        this.handleTradeData(trades),
        this.IntervalRepository.saveCandle(
          TimeScale.SEC_01,
          this.intervalData.get(TimeScale.SEC_01),
        ),
        this.publishOrderBook(),
        ...Array.from(this.intervalData.keys()).map((timeScale) =>
          this.publishCandleData(date, timeScale, this.intervalData.get(timeScale)),
        ),
      ]);
      this.intervalDataInit(TimeScale.SEC_01);
    } catch (error) {
      this.logger.error('Error in everySecond task', error);
    }
  }

  // 매분마다 실행 (0 * * * * *)
  @Cron(CronExpression.EVERY_MINUTE, { timeZone: 'Asia/Seoul' })
  async everyMinute() {
    this.exec(() => {
      const min01Data = this.intervalData.get(TimeScale.MIN_01);
      this.intervalDataInit(TimeScale.MIN_01);
      this.IntervalRepository.saveCandle(TimeScale.MIN_01, min01Data);
    });
  }

  // 10분마다 실행 (0 */10 * * * *)
  @Cron('0 */10 * * * *', { timeZone: 'Asia/Seoul' })
  async everyTenMinutes() {
    this.exec(() => {
      const min10Data = this.intervalData.get(TimeScale.MIN_10);
      this.intervalDataInit(TimeScale.MIN_10);
      this.IntervalRepository.saveCandle(TimeScale.MIN_10, min10Data);
    });
  }

  // 30분마다 실행 (0 */30 * * * *)
  @Cron('0 */30 * * * *', { timeZone: 'Asia/Seoul' })
  async everyThirtyMinutes() {
    this.exec(() => {
      const min30Data = this.intervalData.get(TimeScale.MIN_30);
      this.intervalDataInit(TimeScale.MIN_30);
      this.IntervalRepository.saveCandle(TimeScale.MIN_30, min30Data);
    });
  }

  // 매시간마다 실행 (0 0 * * * *)
  @Cron(CronExpression.EVERY_HOUR, { timeZone: 'Asia/Seoul' })
  async everyHour() {
    this.exec(() => {
      const hour01Data = this.intervalData.get(TimeScale.HOUR_01);
      this.intervalDataInit(TimeScale.HOUR_01);
      this.IntervalRepository.saveCandle(TimeScale.HOUR_01, hour01Data);
    });
  }

  // 매일 특정 시간(예: 00:00)에 실행 (0 0 0 * * *)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Seoul' })
  async everyDay() {
    this.exec(() => {
      const day01Data = this.intervalData.get(TimeScale.DAY_01);
      this.intervalDataInit(TimeScale.DAY_01);
      this.IntervalRepository.saveCandle(TimeScale.DAY_01, day01Data);
    });
  }

  // 매주 월요일 00:00에 실행 (0 0 0 * * 0)
  @Cron('0 0 0 * * MON', { timeZone: 'Asia/Seoul' })
  async everyWeek() {
    this.exec(() => {
      const week01Data = this.intervalData.get(TimeScale.WEEK_01);
      this.intervalDataInit(TimeScale.WEEK_01);
      this.IntervalRepository.saveCandle(TimeScale.WEEK_01, week01Data);
    });
  }

  // 매월 1일 00:00에 실행 (0 0 0 1 * *)
  @Cron('0 0 0 1 * *', { timeZone: 'Asia/Seoul' })
  async everyMonth() {
    this.exec(() => {
      const month01Data = this.intervalData.get(TimeScale.MONTH_01);
      this.intervalDataInit(TimeScale.MONTH_01);
      this.IntervalRepository.saveCandle(TimeScale.MONTH_01, month01Data);
    });
  }

  exec(callback) {
    setTimeout(() => {
      callback();
    }, 50);
  }

  intervalDataInit(timescale: TimeScale) {
    const currentData = this.intervalData.get(timescale);
    this.intervalData.set(
      timescale,
      new CandleDataDto({
        date: new Date(),
        open: currentData.close,
        close: currentData.close,
        high: currentData.close,
        low: currentData.close,
        volume: 0,
      }),
    );
  }

  private async publishOrderBook() {
    try {
      const orderBook = await this.IntervalOrderBookService.getOrderBook();
      await this.redisPublisher.publish(
        RedisChannel.BUY_AND_SELL,
        JSON.stringify({
          event: RedisChannel.BUY_AND_SELL,
          data: orderBook,
        }),
      );
    } catch (error) {
      this.logger.error('Error publishing order book:', error);
    }
  }

  // getSeoulTime() {
  //   return new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
  // }
  private async handleCandleData(date: Date, secData: CandleDataDto) {
    return this.intervalData.forEach((value, timeScale) => {
      const updatedData = this.intervalMakeService.candleAdd(value, secData);
      this.intervalData.set(timeScale, updatedData);
    });
  }

  private async publishCandleData(date: Date, timeScale: TimeScale, currentData: CandleDataDto) {
    try {
      const candleDataArray = [currentData];

      if (this.isTimeScalePoint(date, timeScale)) {
        const nextDate = new Date(currentData.date);

        switch (timeScale) {
          case TimeScale.SEC_01:
            nextDate.setSeconds(nextDate.getSeconds() + 1);
            break;
          case TimeScale.MIN_01:
            nextDate.setMinutes(nextDate.getMinutes() + 1);
            break;
          case TimeScale.MIN_10:
            nextDate.setMinutes(nextDate.getMinutes() + 10);
            break;
          case TimeScale.MIN_30:
            nextDate.setMinutes(nextDate.getMinutes() + 30);
            break;
          case TimeScale.HOUR_01:
            nextDate.setHours(nextDate.getHours() + 1);
            break;
          case TimeScale.DAY_01:
            nextDate.setDate(nextDate.getDate() + 1);
            break;
          case TimeScale.WEEK_01:
            nextDate.setDate(nextDate.getDate() + 7);
            break;
          case TimeScale.MONTH_01:
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        }

        const nextCandleData = this.createNextCandleData(currentData);
        nextCandleData.date = nextDate;

        candleDataArray.push(nextCandleData);
      }
      await this.redisPublisher.publish(
        RedisChannel.CANDLE_CHART,
        JSON.stringify({
          event: RedisChannel.CANDLE_CHART,
          timeScale,
          data: candleDataArray,
        }),
      );
    } catch (error) {
      this.logger.error(`Error publishing candle data for ${timeScale}:`, error);
    }
  }

  private createNextCandleData(currentData: CandleDataDto): CandleDataDto {
    return {
      date: currentData.date,
      open: currentData.close,
      high: currentData.close,
      low: currentData.close,
      close: currentData.close,
      volume: 0,
    };
  }

  private async handleTradeData(trades: any[]) {
    try {
      if (trades.length > 0) {
        await this.redisPublisher.publish(
          RedisChannel.TRADE,
          JSON.stringify({
            event: RedisChannel.TRADE,
            data: trades,
          }),
        );
      }
    } catch (error) {
      this.logger.error('Error handling trade data:', error);
    }
  }

  private isTimeScalePoint(date: Date, timeScale: TimeScale): boolean {
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();

    switch (timeScale) {
      case TimeScale.SEC_01:
        return true;
      case TimeScale.MIN_01:
        return seconds === 0;
      case TimeScale.MIN_10:
        return seconds === 0 && minutes % 10 === 0;
      case TimeScale.MIN_30:
        return seconds === 0 && minutes % 30 === 0;
      case TimeScale.HOUR_01:
        return seconds === 0 && minutes === 0;
      case TimeScale.DAY_01:
        return seconds === 0 && minutes === 0 && hours === 0;
      case TimeScale.WEEK_01:
        return seconds === 0 && minutes === 0 && hours === 0 && dayOfWeek === 1; // 월요일
      case TimeScale.MONTH_01:
        return seconds === 0 && minutes === 0 && hours === 0 && dayOfMonth === 1; // 매월 1일
      default:
        return false;
    }
  }
}
