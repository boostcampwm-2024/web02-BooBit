import { IntervalRepository } from './interval.candle.repository';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';
import { CandleDataDto } from '@app/ws/dto/candle.data.dto';
import { Injectable, Logger, OnModuleDestroy, Inject, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IntervalMakeService } from './interval.make.service';
import { Redis } from 'ioredis';
import { RedisChannel } from '@app/common/enums/redis-channel.enum';
import { IntervalOrderBookService } from './interval.order.book.service';
import { CurrencyCode } from '@app/common';
import { roundToSix } from '@app/common/utils/number.format.util';

@Injectable()
export class IntervalService implements OnModuleDestroy, OnModuleInit {
  private readonly logger = new Logger(IntervalService.name);
  private intervalData: Map<TimeScale, CandleDataDto> = new Map<TimeScale, CandleDataDto>();

  constructor(
    private intervalMakeService: IntervalMakeService,
    private IntervalOrderBookService: IntervalOrderBookService,
    private IntervalRepository: IntervalRepository,
    @Inject('REDIS_PUBLISHER') private readonly redisPublisher: Redis,
  ) {}
  async onModuleInit() {
    const latestPrice = Number(
      (await this.IntervalRepository.getLatestTrade(CurrencyCode.BTC))?.price ?? 0,
    );
    for (const [, value] of Object.entries(TimeScale)) {
      await this.ensureMinimumCandles(value);
    }
    Object.entries(TimeScale).forEach(async ([, value]) => {
      this.intervalData.set(
        value,
        new CandleDataDto({
          date: new Date(),
          open: latestPrice,
          close: latestPrice,
          high: latestPrice,
          low: latestPrice,
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

      const { candle, trades } = await this.intervalMakeService.makeSecData(
        date,
        this.intervalData.get(TimeScale.SEC_01),
      );
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
        const formattedTradeData = trades.map((trade) => ({
          ...trade,
          price: roundToSix(trade.price),
          amount: roundToSix(trade.amount),
          tradePrice: roundToSix(trade.tradePrice),
        }));
        await this.redisPublisher.publish(
          RedisChannel.TRADE,
          JSON.stringify({
            event: RedisChannel.TRADE,
            data: formattedTradeData,
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

  async ensureMinimumCandles(timeScale: TimeScale) {
    this.logger.log(`Ensuring minimum candles for ${timeScale}`);
    const now = new Date();
    const endDate = new Date(now);
    let startDate = new Date(now);

    // timeScale에 따라 시작 시간 조정
    switch (timeScale) {
      case TimeScale.SEC_01:
        startDate.setSeconds(startDate.getSeconds() - 60);
        endDate.setMilliseconds(0);
        startDate.setMilliseconds(0);
        break;
      case TimeScale.MIN_01:
        startDate.setMinutes(startDate.getMinutes() - 60);
        startDate.setSeconds(0, 0);
        endDate.setSeconds(0, 0);
        break;
      case TimeScale.MIN_10:
        startDate.setMinutes(startDate.getMinutes() - 600);
        startDate.setSeconds(0, 0);
        endDate.setSeconds(0, 0);
        if (startDate.getMinutes() % 10 !== 0) {
          startDate.setMinutes(startDate.getMinutes() - (startDate.getMinutes() % 10));
          endDate.setMinutes(endDate.getMinutes() - (endDate.getMinutes() % 10));
        }
        break;
      case TimeScale.MIN_30:
        startDate.setMinutes(startDate.getMinutes() - 1800);
        startDate.setSeconds(0, 0);
        endDate.setSeconds(0, 0);
        if (startDate.getMinutes() % 30 !== 0) {
          startDate.setMinutes(startDate.getMinutes() - (startDate.getMinutes() % 30));
          endDate.setMinutes(endDate.getMinutes() - (endDate.getMinutes() % 30));
        }
        break;
      case TimeScale.HOUR_01:
        startDate.setHours(startDate.getHours() - 60);
        startDate.setMinutes(0, 0, 0);
        endDate.setMinutes(0, 0, 0);
        break;
      case TimeScale.DAY_01:
        startDate.setDate(startDate.getDate() - 60);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        break;
      case TimeScale.WEEK_01:
        startDate.setDate(startDate.getDate() - 420); // 60주
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        break;
      case TimeScale.MONTH_01:
        startDate.setMonth(startDate.getMonth() - 60);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        break;
      default:
        throw new Error(`Unsupported time scale: ${timeScale}`);
    }

    // 해당 기간의 모든 캔들 데이터 조회
    const existingCandles = await this.IntervalRepository.getCandles(
      timeScale,
      CurrencyCode.BTC,
      startDate,
      endDate,
      undefined, // 가져오는 캔들 수 제한 없음
    );

    // 생성 가능한 모든 더미 데이터 생성
    const dummyStartTimes = new Set<string>();
    const dummyStartTime = new Date(startDate);

    while (dummyStartTime < endDate) {
      dummyStartTimes.add(dummyStartTime.toISOString());

      switch (timeScale) {
        case TimeScale.SEC_01:
          dummyStartTime.setSeconds(dummyStartTime.getSeconds() + 1);
          break;
        case TimeScale.MIN_01:
          dummyStartTime.setMinutes(dummyStartTime.getMinutes() + 1);
          break;
        case TimeScale.MIN_10:
          dummyStartTime.setMinutes(dummyStartTime.getMinutes() + 10);
          break;
        case TimeScale.MIN_30:
          dummyStartTime.setMinutes(dummyStartTime.getMinutes() + 30);
          break;
        case TimeScale.HOUR_01:
          dummyStartTime.setHours(dummyStartTime.getHours() + 1);
          break;
        case TimeScale.DAY_01:
          dummyStartTime.setDate(dummyStartTime.getDate() + 1);
          break;
        case TimeScale.WEEK_01:
          dummyStartTime.setDate(dummyStartTime.getDate() + 7);
          break;
        case TimeScale.MONTH_01:
          dummyStartTime.setMonth(dummyStartTime.getMonth() + 1);
          break;
      }
    }

    // 존재하는 캔들의 타임스탬프 제거
    existingCandles.forEach((candle) => {
      dummyStartTimes.delete(candle.startTime.toISOString());
    });

    // 누락된 캔들 생성
    const missingCandlePromises = Array.from(dummyStartTimes).map((timestamp) => {
      return this.IntervalRepository.saveCandle(
        timeScale,
        new CandleDataDto({
          date: new Date(timestamp),
          open: 0,
          close: 0,
          high: 0,
          low: 0,
          volume: 0,
        }),
      );
    });

    await Promise.all(missingCandlePromises);
  }
}
