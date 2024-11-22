import { Injectable } from '@nestjs/common';
import { TradeRepository } from './trade.repository';
import { OrderStatus } from '@app/common/enums/order-status.enum';
import { OrderType } from '@app/common/enums/order-type.enum';
import { TradeHistoryRequestDto } from '@app/grpc/dto/trade.history.request.dto';
import { TradeBuyerRequestDto } from '@app/grpc/dto/trade.buyer.request.dto';
import { TradeSellerRequestDto } from '@app/grpc/dto/trade.seller.request.dto';
import { TradeRequestDto } from '@app/grpc/dto/trade.request.dto';
import { TradeBalanceService } from './trade.balance.service';
import { formatFixedPoint } from '@app/common/utils/number.format.util';

const BATCH_SIZE = 30;

@Injectable()
export class TradeService {
  constructor(
    private tradeRepository: TradeRepository,
    private tradeBalanceService: TradeBalanceService,
  ) {}

  async tradeBuyOrder(historyId: string) {
    const buyOrder = await this.tradeRepository.findBuyOrderByHistoryId(historyId);
    if (!buyOrder) return;

    await this.processTrade(OrderType.BUY, historyId, buyOrder, buyOrder.remainingQuote);
  }

  async tradeSellOrder(historyId: string) {
    const sellOrder = await this.tradeRepository.findSellOrderByHistoryId(historyId);
    if (!sellOrder) return;

    await this.processTrade(OrderType.SELL, historyId, sellOrder, sellOrder.remainingBase);
  }

  async processTrade(type: OrderType, historyId: string, current, amount: number) {
    const { coinCode, price } = current;
    let remain = amount;
    let offset = 0;

    const getOrders = this.getOrderFetcher(type);
    while (remain > 0) {
      const orders = await getOrders(coinCode, price, offset, BATCH_SIZE);

      if (orders.length === 0) break;

      for (const order of orders) {
        if (remain === 0) break;

        const { quantity, tradeHistory } = this.calculateTrade(type, order, remain, historyId);
        remain -= quantity;

        const seller = await this.settleTransaction(type, current, order, quantity, tradeHistory);

        await this.updateOrderAndTradeLog(type, historyId, tradeHistory[0], seller, remain);
      }

      offset += BATCH_SIZE;
    }
  }

  getOrderFetcher(type: OrderType) {
    return type === OrderType.BUY
      ? this.tradeRepository.findSellOrders
      : this.tradeRepository.findBuyOrders;
  }

  calculateTrade(type: OrderType, order, remain: number, historyId: string) {
    let quantity: number;
    const tradeHistory: TradeHistoryRequestDto[] = [];
    const availableAmount =
      type === OrderType.BUY ? Number(order.remainingBase) : Number(order.remainingQuote);

    if (availableAmount <= remain) {
      quantity = availableAmount;
      tradeHistory.push(new TradeHistoryRequestDto(order.historyId, OrderStatus.FILLED, 0));
    } else {
      quantity = remain;
      tradeHistory.push(
        new TradeHistoryRequestDto(
          order.historyId,
          OrderStatus.PARTIALLY_FILLED,
          availableAmount - remain,
        ),
      );
    }

    tradeHistory.push(
      new TradeHistoryRequestDto(
        historyId,
        remain === 0 ? OrderStatus.FILLED : OrderStatus.PARTIALLY_FILLED,
        remain - quantity,
      ),
    );

    return { quantity, tradeHistory };
  }

  async settleTransaction(type, current, order, quantity, tradeHistory) {
    const tradePrice = Number(order.price);
    const buyer = new TradeBuyerRequestDto(
      type === OrderType.BUY ? current.userId : order.userId,
      current.coinCode,
      type === OrderType.BUY ? Number(current.price) : Number(order.price),
      tradePrice,
      quantity,
    );
    const seller = new TradeSellerRequestDto(
      type === OrderType.BUY ? order.userId : current.userId,
      current.coinCode,
      tradePrice,
      quantity,
    );
    const tradeRequest = new TradeRequestDto(buyer, seller, tradeHistory);
    await this.tradeBalanceService.settleTransaction(tradeRequest);

    return seller;
  }

  async updateOrderAndTradeLog(type, historyId, tradeHistory, seller, remain) {
    const trade = {
      buyOrderId: type === OrderType.BUY ? historyId : tradeHistory.historyId,
      sellOrderId: type === OrderType.BUY ? tradeHistory.historyId : historyId,
      coinCode: seller.coinCode,
      price: formatFixedPoint(seller.price),
      quantity: String(seller.quantity),
    };

    if (type === OrderType.BUY) {
      await this.tradeRepository.tradeBuyOrder(tradeHistory, remain, historyId, trade);
    } else {
      await this.tradeRepository.tradeSellOrder(tradeHistory, remain, historyId, trade);
    }
  }
}
