import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { TimeScale } from '@app/common/enums/chart-timescale.enum';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getLatestCandles(tableName: string, count: number) {
    const candles = await this.prisma[tableName].findMany({
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

  async getLatestTrades(count: number = 20) {
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
        price: String(orderRequest.price),
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
        price: String(orderRequest.price),
        originalQuote: String(orderRequest.amount),
        remainingBase: String(orderRequest.amount),
      },
    });
  }
}
