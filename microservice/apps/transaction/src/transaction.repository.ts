import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { formatFixedPoint } from '@app/common/utils/number.format.util';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

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
}
