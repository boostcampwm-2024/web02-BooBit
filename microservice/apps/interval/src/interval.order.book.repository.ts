import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/prisma';

@Injectable()
export class IntervalOrderBookRepository {
  private logger = new Logger(IntervalOrderBookRepository.name);

  constructor(private prisma: PrismaService) {}

  async getLastDayClosePrice(): Promise<number> {
    try {
      const lastCandle = await this.prisma.candle01Day.findFirst({
        orderBy: {
          startTime: 'desc',
        },
        select: {
          closePrice: true,
        },
      });

      return lastCandle ? Number(lastCandle.closePrice) : 0;
    } catch (error) {
      this.logger.error('최근 일봉 종가 조회 중 오류 발생:', error);
      throw error;
    }
  }

  async getLastTradePrice(): Promise<number> {
    try {
      const lastTrade = await this.prisma.trade.findFirst({
        orderBy: {
          tradedAt: 'desc',
        },
        select: {
          price: true,
        },
      });

      return lastTrade ? Number(lastTrade.price) : 0;
    } catch (error) {
      this.logger.error('최근 체결가 조회 중 오류 발생:', error);
      throw error;
    }
  }

  async getSellOrders() {
    try {
      return await this.prisma.sellOrder.findMany({
        select: {
          price: true,
          remainingBase: true,
        },
        orderBy: {
          price: 'desc',
        },
        take: 5,
      });
    } catch (error) {
      this.logger.error('매도 주문 조회 중 오류 발생:', error);
      throw error;
    }
  }

  async getBuyOrders() {
    try {
      return await this.prisma.buyOrder.findMany({
        select: {
          price: true,
          remainingQuote: true,
        },
        orderBy: {
          price: 'desc',
        },
        take: 5,
      });
    } catch (error) {
      this.logger.error('매수 주문 조회 중 오류 발생:', error);
      throw error;
    }
  }
}
