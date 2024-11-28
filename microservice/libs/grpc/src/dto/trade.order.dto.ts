import { formatFixedPoint } from '@app/common/utils/number.format.util';
import { OrderRequestDto } from './order.request.dto';

export class TradeOrder {
  historyId: string;
  userId: string;
  coinCode: string;
  price: string;
  originalQuote: number;

  constructor(historyId: string, orderRequest: OrderRequestDto) {
    this.historyId = historyId;
    this.userId = orderRequest.userId;
    this.coinCode = orderRequest.coinCode;
    this.price = formatFixedPoint(orderRequest.price);
    this.originalQuote = orderRequest.amount;
  }
}
