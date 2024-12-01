import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { TradeOrder } from '@app/grpc/dto/trade.order.dto';
import { CreateTrade } from './dto/trade.create.type';

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

  async tradeBuyOrder(
    deleteIds: string[],
    updates: { historyId: string; remain: number }[],
    trades: CreateTrade[],
  ) {
    await this.prisma.$transaction(async (prisma) => {
      if (deleteIds.length > 0) {
        await this.deleteSellOrders(prisma, deleteIds);
      }

      if (updates.length > 0) {
        await this.updateSellOrdersRemainingBase(prisma, updates);
      }

      await this.createTrades(prisma, trades);
    });
  }

  async tradeSellOrder(
    deleteIds: string[],
    updates: { historyId: string; remain: number }[],
    trades: CreateTrade[],
  ) {
    await this.prisma.$transaction(async (prisma) => {
      if (deleteIds.length > 0) {
        await this.deleteBuyOrders(prisma, deleteIds);
      }

      if (updates.length > 0) {
        await this.updateBuyOrdersRemainingQuote(prisma, updates);
      }

      await this.createTrades(prisma, trades);
    });
  }

  async deleteSellOrders(prisma, historyIds: string[]) {
    return await prisma.sellOrder.deleteMany({
      where: {
        historyId: {
          in: historyIds,
        },
      },
    });
  }

  async deleteBuyOrders(prisma, historyIds: string[]) {
    return await prisma.buyOrder.deleteMany({
      where: {
        historyId: {
          in: historyIds,
        },
      },
    });
  }

  async updateSellOrdersRemainingBase(prisma, updates: { historyId: string; remain: number }[]) {
    const updatePromises = updates.map((update) =>
      prisma.sellOrder.update({
        where: { historyId: update.historyId },
        data: { remainingBase: String(update.remain) },
      }),
    );

    return await Promise.all(updatePromises);
  }

  async updateBuyOrdersRemainingQuote(prisma, updates: { historyId: string; remain: number }[]) {
    const updatePromises = updates.map((update) =>
      prisma.buyOrder.update({
        where: { historyId: update.historyId },
        data: { remainingQuote: String(update.remain) },
      }),
    );

    return await Promise.all(updatePromises);
  }

  async createTrades(prisma, trades: CreateTrade[]) {
    return await prisma.trade.createMany({ data: trades });
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
