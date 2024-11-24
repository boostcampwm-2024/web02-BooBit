import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';
import { formatFixedPoint } from '@app/common/utils/number.format.util';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

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
        tradedAt: true,
        price: true,
        quantity: true,
      },
    });

    return trades;
  }

  async createBuyOrder(orderRequest: OrderRequestDto, historyId: string) {
    return await this.prisma.buyOrder.create({
      data: {
        historyId: historyId,
        userId: orderRequest.userId,
        coinCode: orderRequest.coinCode,
        price: formatFixedPoint(orderRequest.price),
        originalQuote: String(orderRequest.amount),
        remainingQuote: String(orderRequest.amount),
      },
    });
  }

  async createSellOrder(orderRequest: OrderRequestDto, historyId: string) {
    return await this.prisma.sellOrder.create({
      data: {
        historyId: historyId,
        userId: orderRequest.userId,
        coinCode: orderRequest.coinCode,
        price: formatFixedPoint(orderRequest.price),
        originalQuote: String(orderRequest.amount),
        remainingBase: String(orderRequest.amount),
      },
    });
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
}
