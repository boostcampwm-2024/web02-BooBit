import { Injectable, NotFoundException } from '@nestjs/common';
import { TradeRepository } from './trade.repository';
import { OrderType } from '@app/common/enums/order-type.enum';
import { TradeHistoryRequestDto } from '@app/grpc/dto/trade.history.request.dto';
import { TradeBuyerRequestDto } from '@app/grpc/dto/trade.buyer.request.dto';
import { TradeSellerRequestDto } from '@app/grpc/dto/trade.seller.request.dto';
import { TradeRequestDto } from '@app/grpc/dto/trade.request.dto';
import { TradeBalanceService } from './trade.balance.service';
import { TradeCancelRequestDto } from '@app/grpc/dto/trade.cancel.request.dto';
import { BuyOrder } from './dto/trade.buy.order.type';
import { SellOrder } from './dto/trade.sell.order.type';
import { TradeOrder } from '@app/grpc/dto/trade.order.dto';

const BATCH_SIZE = 30;

@Injectable()
export class TradeService {
  constructor(
    private tradeRepository: TradeRepository,
    private tradeBalanceService: TradeBalanceService,
  ) {}

  async processTrade(type: OrderType, current: TradeOrder) {
    const { coinCode, price } = current;
    let remain = current.originalQuote;
    let offset = 0;

    const getOrders = this.getOrdersFetcher(type);
    while (remain > 0) {
      const orders = await getOrders(coinCode, price, offset, BATCH_SIZE);

      if (orders.length === 0) break;

      for (const order of orders) {
        if (remain === 0) break;

        const { quantity, opposite } = this.calculateTrade(order, remain);
        remain -= quantity; // 계산 문제 발생 가능

        const tradePrice = order.price;
        await this.settleTransaction(type, current, order, tradePrice, quantity);

        await this.updateOrderAndTradeLog(type, current, opposite, coinCode, order.price, quantity);
      }

      offset += BATCH_SIZE;
    }

    await this.createTradeOrder(type, current, remain);
  }

  getOrdersFetcher(type: OrderType) {
    return type === OrderType.BUY
      ? (coinCode: string, price: string, offset: number, batchSize: number) =>
          this.tradeRepository.findSellOrders(coinCode, price, offset, batchSize)
      : (coinCode: string, price: string, offset: number, batchSize: number) =>
          this.tradeRepository.findBuyOrders(coinCode, price, offset, batchSize);
  }

  calculateTrade(order: BuyOrder | SellOrder, remain: number) {
    let quantity: number;
    const availableAmount = Number(this.getRemain(order));

    if (availableAmount <= remain) {
      quantity = availableAmount;
    } else {
      quantity = remain;
    }

    const opposite = new TradeHistoryRequestDto(
      order.historyId,
      order.userId,
      availableAmount - quantity,
    );
    return { quantity, opposite };
  }

  getRemain(order: BuyOrder | SellOrder) {
    if ('remainingQuote' in order) {
      return order.remainingQuote;
    }
    if ('remainingBase' in order) {
      return order.remainingBase;
    }
    throw new NotFoundException('Invalid order type');
  }

  async settleTransaction(
    type: OrderType,
    current: TradeOrder,
    order: BuyOrder | SellOrder,
    tradePrice: string,
    quantity: number,
  ) {
    const buyer = new TradeBuyerRequestDto(
      type === OrderType.BUY ? current.userId : order.userId,
      current.coinCode,
      type === OrderType.BUY ? current.price : order.price,
      tradePrice,
      String(quantity),
    );
    const seller = new TradeSellerRequestDto(
      type === OrderType.BUY ? order.userId : current.userId,
      current.coinCode,
      tradePrice,
      String(quantity),
    );
    const tradeRequest = new TradeRequestDto(buyer, seller);
    await this.tradeBalanceService.settleTransaction(tradeRequest);
  }

  async updateOrderAndTradeLog(
    type: OrderType,
    current: TradeOrder,
    opposite: TradeHistoryRequestDto,
    coinCode: string,
    tradePrice: string,
    quantity: number,
  ) {
    const trade = {
      buyerId: type === OrderType.BUY ? current.userId : opposite.userId,
      buyOrderId: type === OrderType.BUY ? current.historyId : opposite.historyId,
      sellerId: type === OrderType.BUY ? opposite.userId : current.userId,
      sellOrderId: type === OrderType.BUY ? opposite.historyId : current.historyId,
      coinCode: coinCode,
      price: tradePrice,
      quantity: String(quantity),
    };

    if (type === OrderType.BUY) {
      await this.tradeRepository.tradeBuyOrder(opposite, trade);
    } else {
      await this.tradeRepository.tradeSellOrder(opposite, trade);
    }
  }

  async createTradeOrder(type: OrderType, current: TradeOrder, remain: number) {
    if (remain === 0) return;

    if (type === OrderType.BUY) {
      await this.tradeRepository.createBuyOrder(current, remain);
    } else {
      await this.tradeRepository.createSellOrder(current, remain);
    }
  }

  async cancelOrder(userId: bigint, historyId: string, orderType: OrderType) {
    const getOrder = this.getOrderFetcher(orderType);
    const order: BuyOrder | SellOrder = await getOrder(historyId);

    if (!order) return;

    const deleteOrder = this.deleteOrderFetcher(orderType);
    await deleteOrder(historyId);

    const remain = this.getRemain(order);
    const cancelRequest = new TradeCancelRequestDto(
      String(userId),
      order.coinCode,
      order.price,
      remain,
      orderType,
    );
    await this.tradeBalanceService.cancelOrder(cancelRequest);
  }

  getOrderFetcher(type: OrderType) {
    return type === OrderType.BUY
      ? (historyId: string) => this.tradeRepository.findBuyOrderByHistoryId(historyId)
      : (historyId: string) => this.tradeRepository.findSellOrderByHistoryId(historyId);
  }

  deleteOrderFetcher(type: OrderType) {
    return type === OrderType.BUY
      ? (historyId: string) => this.tradeRepository.deleteBuyOrderByHistoryId(historyId)
      : (historyId: string) => this.tradeRepository.deleteSellOrderByHistoryId(historyId);
  }
}
