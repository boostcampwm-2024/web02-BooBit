import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { Prisma } from '@prisma/client';

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

  async getSellOrders() {
    try {
      const result = await this.prisma.sellOrder.aggregateRaw({
        pipeline: [
          {
            $addFields: {
              remaining_base_double: { $toDouble: '$remaining_base' },
            },
          },
          {
            $group: {
              _id: '$price',
              totalRemainingBase: { $sum: '$remaining_base_double' },
            },
          },
          {
            $sort: { _id: 1 },
          },
          {
            $limit: 5,
          },
          {
            $sort: { _id: -1 },
          },
        ],
      });
      const aggregatedData = result as unknown as Prisma.JsonArray;
      return aggregatedData.map((item) => {
        const data = item as { _id: number; totalRemainingBase: number };
        return {
          price: data._id,
          remainingBase: data.totalRemainingBase,
        };
      });
    } catch (error) {
      this.logger.error('매도 주문 조회 중 오류 발생:', error);
      throw error;
    }
  }

  async getBuyOrders() {
    try {
      const result = await this.prisma.buyOrder.aggregateRaw({
        pipeline: [
          {
            $addFields: {
              remaining_quote_double: { $toDouble: '$remaining_quote' },
            },
          },
          {
            $group: {
              _id: '$price',
              totalRemainingQuote: { $sum: '$remaining_quote_double' },
            },
          },
          {
            $sort: { _id: -1 },
          },
          {
            $limit: 5,
          },
        ],
      });
      const aggregatedData = result as unknown as Prisma.JsonArray;
      return aggregatedData.map((item) => {
        const data = item as { _id: number; totalRemainingQuote: number };
        return {
          price: data._id,
          remainingQuote: data.totalRemainingQuote,
        };
      });
    } catch (error) {
      this.logger.error('매수 주문 조회 중 오류 발생:', error);
      throw error;
    }
  }
}
