import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { TradeHistoryRequestDto } from '@app/grpc/dto/trade.history.request.dto';
import { OrderStatus } from '@app/common/enums/order-status.enum';

@Injectable()
export class TradeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBuyOrderByHistoryId(historyId: string) {
    return await this.prisma.buyOrder.findUnique({
      select: {
        userId: true,
        coinCode: true,
        price: true,
        remainingQuote: true,
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
        coinCode: true,
        price: true,
        remainingBase: true,
      },
      where: {
        historyId: historyId,
      },
    });
  }

  async findSellOrders(coinCode: string, price: string, offset: number, batchSize: number) {
    return await this.prisma.sellOrder.findMany({
      select: {
        historyId: true,
        userId: true,
        price: true,
        remainingBase: true,
        createdAt: true,
      },
      where: {
        price: { lte: price },
        coinCode: coinCode,
      },
      orderBy: [{ price: 'asc' }, { createdAt: 'asc' }],
      skip: offset,
      take: batchSize,
    });
  }

  async findBuyOrders(coinCode: string, price: string, offset: number, batchSize: number) {
    return await this.prisma.buyOrder.findMany({
      select: {
        historyId: true,
        userId: true,
        price: true,
        remainingQuote: true,
        createdAt: true,
      },
      where: {
        price: { gte: price },
        coinCode: coinCode,
      },
      orderBy: [{ price: 'desc' }, { createdAt: 'asc' }],
      skip: offset,
      take: batchSize,
    });
  }

  async tradeBuyOrder(history: TradeHistoryRequestDto, remain: number, historyId: string, trade) {
    await this.prisma.$transaction(async (prisma) => {
      if (history.status === OrderStatus.FILLED) {
        await this.deleteSellOrder(prisma, history.historyId);
      } else {
        await this.updateSellOrderRemainingBase(prisma, history.historyId, history.remain);
      }

      if (remain === 0) {
        await this.deleteBuyOrder(prisma, historyId);
      } else {
        await this.updateBuyOrderRemainingQuote(prisma, historyId, remain);
      }

      await this.createTrade(prisma, trade);
    });
  }

  async tradeSellOrder(history: TradeHistoryRequestDto, remain: number, historyId: string, trade) {
    await this.prisma.$transaction(async (prisma) => {
      if (history.status === OrderStatus.FILLED) {
        await this.deleteBuyOrder(prisma, history.historyId);
      } else {
        await this.updateBuyOrderRemainingQuote(prisma, history.historyId, history.remain);
      }

      if (remain === 0) {
        await this.deleteSellOrder(prisma, historyId);
      } else {
        await this.updateSellOrderRemainingBase(prisma, historyId, remain);
      }

      await this.createTrade(prisma, trade);
    });
  }

  async deleteSellOrder(prisma, historyId: string) {
    return await prisma.sellOrder.deleteMany({
      where: {
        historyId: historyId,
      },
    });
  }

  async deleteBuyOrder(prisma, historyId: string) {
    return await prisma.buyOrder.deleteMany({
      where: {
        historyId: historyId,
      },
    });
  }

  async updateSellOrderRemainingBase(prisma, historyId: string, remainingBase: number) {
    return await prisma.sellOrder.update({
      where: {
        historyId: historyId,
      },
      data: {
        remainingBase: String(remainingBase),
      },
    });
  }

  async updateBuyOrderRemainingQuote(prisma, historyId: string, remainingQuote: number) {
    return await prisma.buyOrder.update({
      where: {
        historyId: historyId,
      },
      data: {
        remainingQuote: String(remainingQuote),
      },
    });
  }

  async createTrade(prisma, trade) {
    return await prisma.trade.create({ data: trade });
  }

  async deleteBuyOrderByHistoryId(historyId) {
    return await this.prisma.buyOrder.delete({
      where: { historyId: BigInt(historyId) },
    });
  }

  async deleteSellOrderByHistoryId(historyId) {
    return await this.prisma.sellOrder.delete({
      where: { historyId: BigInt(historyId) },
    });
  }
}
