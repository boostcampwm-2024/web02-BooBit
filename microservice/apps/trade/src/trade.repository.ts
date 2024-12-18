import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { TradeHistoryRequestDto } from '@app/grpc/dto/trade.history.request.dto';
import { TradeOrder } from '@app/grpc/dto/trade.order.dto';

@Injectable()
export class TradeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBuyOrderByHistoryId(historyId: string) {
    return await this.prisma.buyOrder.findUnique({
      select: {
        historyId: true,
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
        historyId: true,
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
        coinCode: true,
        price: true,
        remainingBase: true,
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
        coinCode: true,
        price: true,
        remainingQuote: true,
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

  async tradeBuyOrder(opposite: TradeHistoryRequestDto, trade) {
    await this.prisma.$transaction(async (prisma) => {
      if (opposite.remain === 0) {
        await this.deleteSellOrder(prisma, opposite.historyId);
      } else {
        await this.updateSellOrderRemainingBase(prisma, opposite.historyId, opposite.remain);
      }

      await this.createTrade(prisma, trade);
    });
  }

  async tradeSellOrder(opposite: TradeHistoryRequestDto, trade) {
    await this.prisma.$transaction(async (prisma) => {
      if (opposite.remain === 0) {
        await this.deleteBuyOrder(prisma, opposite.historyId);
      } else {
        await this.updateBuyOrderRemainingQuote(prisma, opposite.historyId, opposite.remain);
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
      where: { historyId: historyId },
    });
  }

  async deleteSellOrderByHistoryId(historyId) {
    return await this.prisma.sellOrder.delete({
      where: { historyId: historyId },
    });
  }

  async createBuyOrder(current: TradeOrder, remain: number) {
    return await this.prisma.buyOrder.create({
      data: {
        historyId: current.historyId,
        userId: current.userId,
        coinCode: current.coinCode,
        price: current.price,
        originalQuote: String(current.originalQuote),
        remainingQuote: String(remain),
      },
    });
  }

  async createSellOrder(current: TradeOrder, remain: number) {
    return await this.prisma.sellOrder.create({
      data: {
        historyId: current.historyId,
        userId: current.userId,
        coinCode: current.coinCode,
        price: current.price,
        originalQuote: String(current.originalQuote),
        remainingBase: String(remain),
      },
    });
  }
}
