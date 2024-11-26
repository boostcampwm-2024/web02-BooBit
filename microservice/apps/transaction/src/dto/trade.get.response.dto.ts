import { OrderType } from '@app/common/enums/order-type.enum';
import { roundToSix } from '@app/common/utils/number.format.util';

export class TradeGetResponseDto {
  tradeId: string;
  orderType: OrderType;
  coinCode: string;
  price: number;
  quantity: number;
  totalAmount: number;
  tradedAt: Date;

  constructor(
    tradeId: string,
    orderType: OrderType,
    coinCode: string,
    price: string,
    quantity: string,
    tradedAt: Date,
  ) {
    this.tradeId = tradeId;
    this.orderType = orderType;
    this.coinCode = coinCode;
    this.price = roundToSix(Number(price));
    this.quantity = roundToSix(Number(quantity));
    this.totalAmount = roundToSix(this.price * this.quantity);
    this.tradedAt = tradedAt;
  }
}
