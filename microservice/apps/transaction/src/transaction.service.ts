import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { OrderResponseDto } from '@app/grpc/dto/order.response.dto';
import { GrpcOrderStatusCode } from '@app/common/enums/grpc-status.enum';
import { OrderType } from '@app/common/enums/order-type.enum';
import { OrderPendingResponseDto } from './dto/order.pending.response.dto';
import { TradeGetResponseDto } from './dto/trade.get.response.dto';

@Injectable()
export class TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  validateOrderResponse(orderResponse: OrderResponseDto) {
    if (orderResponse.status === GrpcOrderStatusCode.NO_BALANCE) {
      throw new BadRequestException('Not Enough Balance');
    } else if (orderResponse.status === GrpcOrderStatusCode.TRANSACTION_ERROR) {
      throw new InternalServerErrorException('Internal Server Transaction Error');
    }
  }

  async validateOrderOwnership(userId: string, historyId: string, orderType: OrderType) {
    const getOrder = this.getOrderFetcher(orderType);
    const order = await getOrder(historyId);

    if (!order) {
      throw new NotFoundException(`${historyId} 주문은 이미 체결되었습니다.`);
    }

    if (order.userId !== userId) {
      throw new ForbiddenException(`${historyId} 주문을 취소할 권한이 없습니다.`);
    }
  }

  getOrderFetcher(type: OrderType) {
    return type === OrderType.BUY
      ? (historyId: string) => this.transactionRepository.findBuyOrderByHistoryId(historyId)
      : (historyId: string) => this.transactionRepository.findSellOrderByHistoryId(historyId);
  }

  async getPending(userId: bigint, historyId?: string) {
    const orders = await this.transactionRepository.getRecentOrders(String(userId), historyId);
    const nextId = orders.length > 30 ? orders.pop().historyId : null;
    return new OrderPendingResponseDto(nextId, orders.slice(0, 30));
  }

  async getOrders(userId: string, lastId: string) {
    const trades = await this.transactionRepository.getTradeOrders(userId, lastId);
    const nextId = trades.length > 30 ? trades.pop().tradeId : null;
    const orders: TradeGetResponseDto[] = [];

    trades.forEach((trade) => {
      if (trade.buyerId === userId) {
        orders.push(
          new TradeGetResponseDto(
            trade.tradeId,
            OrderType.BUY,
            trade.coinCode,
            trade.price,
            trade.quantity,
            trade.tradedAt,
          ),
        );
      }

      if (trade.sellerId === userId) {
        orders.push(
          new TradeGetResponseDto(
            trade.tradeId,
            OrderType.SELL,
            trade.coinCode,
            trade.price,
            trade.quantity,
            trade.tradedAt,
          ),
        );
      }
    });

    return { nextId, orders };
  }

  async getPrice(/*coinCode: CurrencyCode*/) {
    return (await this.transactionRepository.getLatestTrades(1)).reduce((acc, trade) => {
      return acc + Number(trade.price);
    }, 0);
  }
}
