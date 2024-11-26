import { Injectable, Logger } from '@nestjs/common';
import { IntervalOrderBookRepository } from './interval.order.book.repository';
import { OrderBookDto, OrderItemDto } from './dto/order.book.dto';

@Injectable()
export class IntervalOrderBookService {
  private readonly logger = new Logger(IntervalOrderBookService.name);

  constructor(private readonly orderBookRepository: IntervalOrderBookRepository) {}

  async getOrderBook(): Promise<OrderBookDto> {
    try {
      const [sellOrders, buyOrders, lastDayClose] = await Promise.all([
        this.orderBookRepository.getSellOrders(),
        this.orderBookRepository.getBuyOrders(),
        this.orderBookRepository.getLastDayClosePrice(),
      ]);

      const calculatePriceChangeRate = (price: number): number => {
        return lastDayClose ? ((price - lastDayClose) / lastDayClose) * 100 : 0;
      };

      return {
        sell: sellOrders.map(
          (order): OrderItemDto => ({
            price: Number(order.price),
            priceChangeRate: calculatePriceChangeRate(Number(order.price)),
            amount: Number(order.remainingBase),
          }),
        ),
        buy: buyOrders.map(
          (order): OrderItemDto => ({
            price: Number(order.price),
            priceChangeRate: calculatePriceChangeRate(Number(order.price)),
            amount: Number(order.remainingQuote),
          }),
        ),
      };
    } catch (error) {
      this.logger.error('호가 데이터 처리 중 오류 발생:', error);
      throw error;
    }
  }
}
