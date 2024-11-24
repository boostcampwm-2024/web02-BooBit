import { TimeScale } from '@app/common/enums/chart-timescale.enum';
import { CandleDataDto } from '@app/ws/dto/candle.data.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class IntervalService {
  private readonly logger = new Logger(IntervalService.name);
  private intervalData: Map<TimeScale, CandleDataDto> = new Map<TimeScale, CandleDataDto>();

  constructor(@Inject('IntervalMakeService') private readonly intervalMakeService) {
    Object.entries(TimeScale).forEach(async ([, value]) => {
      this.intervalData.set(
        value,
        new CandleDataDto({ date: new Date(), open: 0, close: 0, high: 0, low: 0, volume: 0 }),
      );
    });
  }

  // 매초마다 실행 (* * * * * *)
  @Cron(CronExpression.EVERY_SECOND, { timeZone: 'Asia/Seoul' })
  async everySecond() {
    try {
      const secData = this.intervalMakeService.makeSecData(new Date().setMilliseconds(0));
      this.intervalData.forEach((value, key, map) => {
        map.set(key, this.intervalMakeService.candleAdd(value, secData));
      });

      this.logger.debug(secData.toString());

      //redis pub/sub에 데이터 전송
    } catch (error) {
      this.logger.error('Error in everySecond task', error);
    }
  }

  // 매분마다 실행 (0 * * * * *)
  @Cron(CronExpression.EVERY_MINUTE, { timeZone: 'Asia/Seoul' })
  async everyMinute() {
    this.exec(() => {
      this.logger.debug(this.intervalData.get(TimeScale.MIN_01).toString());
      this.intervallDataInit(TimeScale.MIN_01);
    });
  }

  // 10분마다 실행 (0 */10 * * * *)
  @Cron('0 */10 * * * *', { timeZone: 'Asia/Seoul' })
  async everyTenMinutes() {}

  // 30분마다 실행 (0 */30 * * * *)
  @Cron('0 */30 * * * *', { timeZone: 'Asia/Seoul' })
  async everyThirtyMinutes() {}

  // 매시간마다 실행 (0 0 * * * *)
  @Cron(CronExpression.EVERY_HOUR, { timeZone: 'Asia/Seoul' })
  async everyHour() {}

  // 매일 특정 시간(예: 00:00)에 실행 (0 0 0 * * *)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Seoul' })
  async everyDay() {}

  // 매주 월요일 00:00에 실행 (0 0 0 * * 0)
  @Cron('0 0 0 * * MON', { timeZone: 'Asia/Seoul' })
  async everyWeek() {}

  // 매월 1일 00:00에 실행 (0 0 0 1 * *)
  @Cron('0 0 0 1 * *', { timeZone: 'Asia/Seoul' })
  async everyMonth() {}

  exec(callback) {
    setTimeout(() => {
      callback();
    }, 50);
  }

  intervallDataInit(timescale: TimeScale) {
    this.intervalData[timescale] = new CandleDataDto({
      date: new Date(),
      open: 0,
      close: 0,
      high: 0,
      low: 0,
      volume: 0,
    });
  }
}
