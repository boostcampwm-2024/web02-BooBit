import { CurrencyCode } from '@app/common';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';
import { PrismaService } from '@app/prisma';
import { CandleDataDto } from '@app/ws/dto/candle.data.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class IntervalRepository {
  private logger = new Logger(IntervalRepository.name);
  private getSeoulDate(date: Date): Date {
    return new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  }
  constructor(private prisma: PrismaService) {}

  private getModelForInterval(interval: TimeScale) {
    const modelMap = {
      '1sec': this.prisma.candle01Sec,
      '1min': this.prisma.candle01Min,
      '10min': this.prisma.candle10Min,
      '30min': this.prisma.candle30Min,
      '1hour': this.prisma.candle01Hour,
      '1day': this.prisma.candle01Day,
      '1week': this.prisma.candle01Week,
      '1month': this.prisma.candle01Month,
    };
    return modelMap[interval];
  }
  async getLatestTrade(coinCode: string) {
    try {
      const trade = await this.prisma.trade.findFirst({
        orderBy: {
          tradedAt: 'desc',
        },
      });
      return trade;
    } catch (error) {
      console.error('최근 거래 내역 조회 중 오류 발생:', error);
      throw error;
    }
  }

  async getTradesByDateRange(startDate: Date, endDate: Date, coinCode: string) {
    try {
      const trades = await this.prisma.trade.findMany({
        where: {
          tradedAt: {
            gte: startDate,
            lt: endDate,
          },
          coinCode: coinCode,
        },
        orderBy: {
          tradedAt: 'desc',
        },
      });

      return trades;
    } catch (error) {
      console.error('거래 내역 조회 중 오류 발생:', error);
      throw error;
    }
  }

  async saveCandle(interval: TimeScale, data: CandleDataDto) {
    const model = this.getModelForInterval(interval);
    const seoulDate = this.getSeoulDate(data.date);

    try {
      return await model.create({
        data: {
          coinCode: CurrencyCode.BTC,
          startTime: seoulDate,
          openPrice: data.open.toString(),
          highPrice: data.high.toString(),
          lowPrice: data.low.toString(),
          closePrice: data.close.toString(),
          volume: data.volume.toString(),
        },
      });
    } catch (error) {
      this.logger.error('Error in saveCandle', error);
    }
  }

  async getCandles(
    interval: TimeScale,
    coinCode: string,
    startTime: Date,
    endTime: Date,
    limit?: number,
  ) {
    const model = this.getModelForInterval(interval);

    return await (model as any).findMany({
      where: {
        coinCode,
        startTime: {
          gte: startTime,
          lt: endTime,
        },
      },
      orderBy: {
        startTime: 'desc',
      },
      take: limit,
    });
  }
}
