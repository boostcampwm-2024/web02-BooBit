import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';
import { OrderType } from '@app/common/enums/order-type.enum';
import { OrderPendingDto } from './dto/order.pending.dto';

@Injectable()
export class TransactionRepository {
  private readonly logger = new Logger(TransactionRepository.name);
  constructor(private readonly prisma: PrismaService) {}

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
      throw error;
    }
  }

  async getLatestCandles(timeScale: TimeScale, count: number) {
    const modelName = this.getTableName(timeScale);
    const candles = await this.prisma[modelName].findMany({
      take: count,
      orderBy: {
        startTime: 'desc',
      },
      select: {
        startTime: true,
        openPrice: true,
        closePrice: true,
        highPrice: true,
        lowPrice: true,
        volume: true,
      },
    });

    return candles;
  }

  async getLatestTrades(count: number) {
    const trades = await this.prisma.trade.findMany({
      take: count,
      orderBy: {
        tradedAt: 'desc',
      },
      select: {
        tradeId: true,
        tradedAt: true,
        price: true,
        quantity: true,
      },
    });

    return trades;
  }

  private getTableName(timeScale: TimeScale): string {
    const tableMap = {
      [TimeScale.SEC_01]: 'candle01Sec',
      [TimeScale.MIN_01]: 'candle01Min',
      [TimeScale.MIN_10]: 'candle10Min',
      [TimeScale.MIN_30]: 'candle30Min',
      [TimeScale.HOUR_01]: 'candle01Hour',
      [TimeScale.DAY_01]: 'candle01Day',
      [TimeScale.WEEK_01]: 'candle01Week',
      [TimeScale.MONTH_01]: 'candle01Month',
    };

    return tableMap[timeScale];
  }

  async findBuyOrderByHistoryId(historyId: string) {
    return await this.prisma.buyOrder.findUnique({
      select: {
        userId: true,
      },
      where: {
        historyId: historyId,
      },
    });
  }

  async findSellOrderByHistoryId(historyId: string) {
    return await this.prisma.sellOrder.findUnique({
      select: {
        userId: true,
      },
      where: {
        historyId: historyId,
      },
    });
  }

  async findBuyOrdersByUserId(userId: bigint) {
    return await this.prisma.buyOrder.findMany({
      select: {
        historyId: true,
        coinCode: true,
        price: true,
        originalQuote: true,
        remainingQuote: true,
        createdAt: true,
      },
      where: {
        userId: String(userId),
      },
    });
  }

  async findSellOrdersByUserId(userId: bigint) {
    return await this.prisma.sellOrder.findMany({
      select: {
        historyId: true,
        coinCode: true,
        price: true,
        originalQuote: true,
        remainingBase: true,
        createdAt: true,
      },
      where: {
        userId: String(userId),
      },
    });
  }

  async getTradeOrders(userId: string, lastId?: string) {
    return await this.prisma.trade.findMany({
      select: {
        tradeId: true,
        buyerId: true,
        buyOrderId: true,
        sellerId: true,
        sellOrderId: true,
        coinCode: true,
        price: true,
        quantity: true,
        tradedAt: true,
      },
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
        ...(lastId ? { tradeId: { lte: lastId } } : {}),
      },
      orderBy: {
        tradedAt: 'desc',
      },
      take: 31,
    });
  }
  async getRecentOrders(userId: string, historyId?: string) {
    const orders = await this.prisma.$runCommandRaw({
      aggregate: 'buy_order',
      pipeline: [
        {
          $match: {
            user_id: userId,
            ...(historyId && {
              _id: {
                $lte: historyId,
              },
            }),
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $limit: 31,
        },
        {
          $addFields: {
            order_type: 'BUY',
            remaining_amount: '$remaining_quote', // remaining_quote를 remaining_amount로 통일
          },
        },
        {
          $unionWith: {
            coll: 'sell_order',
            pipeline: [
              {
                $match: {
                  user_id: userId,
                  ...(historyId && {
                    _id: {
                      $lte: historyId,
                    },
                  }),
                },
              },
              {
                $sort: { _id: -1 },
              },
              {
                $limit: 31,
              },
              {
                $addFields: {
                  order_type: 'SELL',
                  remaining_amount: '$remaining_base', // remaining_base를 remaining_amount로 통일
                },
              },
            ],
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $limit: 31,
        },
      ],
      cursor: {},
    });
    const aggregatedData = orders as {
      cursor: {
        firstBatch: {
          _id: string;
          order_type: string;
          price: string;
          original_quote: string;
          remaining_amount: string; // remaining_amount로 통일
          created_at: object;
        }[];
      };
    };
    return aggregatedData.cursor.firstBatch.map((item) => {
      const data = item as {
        _id: string;
        order_type: string;
        price: string;
        original_quote: string;
        remaining_amount: string; // remaining_amount로 통일
        created_at: object;
      };
      return new OrderPendingDto(
        data._id,
        data.order_type as OrderType,
        data.price,
        data.original_quote,
        data.remaining_amount, // remaining_amount로 통일
        (data.created_at as { $date: string }).$date,
      );
    });
  }
}
