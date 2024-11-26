import { Injectable, Logger } from '@nestjs/common';
import { IntervalOrderBookRepository } from './interval.order.book.repository';
import { OrderBookDto, OrderItemDto } from './dto/order.book.dto';
import { roundToThree } from '@app/common/utils/number.format.util';

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
        return lastDayClose
          ? roundToThree(((price - lastDayClose) / lastDayClose) * 100)
          : roundToThree(0);
      };

      return {
        sell: sellOrders.map(
          (order): OrderItemDto => ({
            price: roundToThree(Number(order.price)),
            priceChangeRate: roundToThree(calculatePriceChangeRate(Number(order.price))),
            amount: roundToThree(Number(order.remainingBase)),
          }),
        ),
        buy: buyOrders.map(
          (order): OrderItemDto => ({
            price: roundToThree(Number(order.price)),
            priceChangeRate: roundToThree(calculatePriceChangeRate(Number(order.price))),
            amount: roundToThree(Number(order.remainingQuote)),
          }),
        ),
      };
    } catch (error) {
      this.logger.error('호가 데이터 처리 중 오류 발생:', error);
      throw error;
    }
  }
}
