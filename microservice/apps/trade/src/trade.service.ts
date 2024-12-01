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
import { CreateTrade } from './dto/trade.create.type';
import { TradeRequestListDto } from '@app/grpc/dto/trade.request.list.dto';

const BATCH_SIZE = 30;

@Injectable()
export class TradeService {
  constructor(
    private tradeRepository: TradeRepository,
    private tradeBalanceService: TradeBalanceService,
  ) {}

  async processTrade(type: OrderType, current: TradeOrder) {
    const { coinCode, price } = current;
    const requests: TradeRequestDto[] = [];
    const deleteIds: string[] = [];
    const updates = [];
    const trades: CreateTrade[] = [];
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
        requests.push(this.makeTransaction(type, current, order, tradePrice, quantity));

        this.updateOrder(opposite, deleteIds, updates);
        trades.push(this.makeTrade(type, current, opposite, coinCode, order.price, quantity));
      }

      offset += BATCH_SIZE;
    }

    if (trades.length > 0) {
      await this.tradeBalanceService.settleTransaction(new TradeRequestListDto(requests));
      await this.updateOrdersAndTrades(type, deleteIds, updates, trades);
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

  makeTransaction(
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
    return new TradeRequestDto(buyer, seller);
  }

  makeTrade(
    type: OrderType,
    current: TradeOrder,
    opposite: TradeHistoryRequestDto,
    coinCode: string,
    tradePrice: string,
    quantity: number,
  ) {
    return {
      buyerId: type === OrderType.BUY ? current.userId : opposite.userId,
      buyOrderId: type === OrderType.BUY ? current.historyId : opposite.historyId,
      sellerId: type === OrderType.BUY ? opposite.userId : current.userId,
      sellOrderId: type === OrderType.BUY ? opposite.historyId : current.historyId,
      coinCode: coinCode,
      price: tradePrice,
      quantity: String(quantity),
    };
  }

  updateOrder(
    opposite: TradeHistoryRequestDto,
    deleteIds: string[],
    updates: { historyId: string; remain: number }[],
  ) {
    const { remain, historyId } = opposite;

    if (remain === 0) {
      deleteIds.push(historyId);
    } else {
      updates.push({ historyId, remain });
    }
  }

  async updateOrdersAndTrades(
    type: OrderType,
    deleteIds: string[],
    updates: { historyId: string; remain: number }[],
    trades: CreateTrade[],
  ) {
    if (type === OrderType.BUY) {
      await this.tradeRepository.tradeBuyOrder(deleteIds, updates, trades);
    } else {
      await this.tradeRepository.tradeSellOrder(deleteIds, updates, trades);
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
