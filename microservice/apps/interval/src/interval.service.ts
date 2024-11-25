import { IntervalRepository } from './interval.candle.repository';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';
import { CandleDataDto } from '@app/ws/dto/candle.data.dto';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IntervalMakeService } from './interval.make.service';

@Injectable()
export class IntervalService {
  private readonly logger = new Logger(IntervalService.name);
  private intervalData: Map<TimeScale, CandleDataDto> = new Map<TimeScale, CandleDataDto>();

  constructor(
    private intervalMakeService: IntervalMakeService,
    private IntervalRepository: IntervalRepository,
  ) {
    Object.entries(TimeScale).forEach(async ([, value]) => {
      this.intervalData.set(
        value,
        new CandleDataDto({
          date: this.getSeoulDate(),
          open: 0,
          close: 0,
          high: 0,
          low: 0,
          volume: 0,
        }),
      );
    });
  }

  // 매초마다 실행 (* * * * * *)
  @Cron(CronExpression.EVERY_SECOND, { timeZone: 'Asia/Seoul' })
  async everySecond() {
    try {
      const date = this.getSeoulDate();
      date.setMilliseconds(0);

      const secData = await this.intervalMakeService.makeSecData(date);
      this.intervalData.forEach((value, key, map) => {
        map.set(key, this.intervalMakeService.candleAdd(value, secData));
      });

      this.IntervalRepository.saveCandle(TimeScale.SEC_01, secData);
      // redis pub/sub에 데이터 전송 intervalData
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
      // redis pub/sub에 데이터 전송 intervalData를 전송
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
    this.intervalData[timescale] = new CandleDataDto({
      date: new Date(),
      open: 0,
      close: 0,
      high: 0,
      low: 0,
      volume: 0,
    });
  }

  getSeoulDate(): Date {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  }
}
