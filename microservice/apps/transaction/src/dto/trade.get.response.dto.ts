import { OrderType } from '@app/common/enums/order-type.enum';
import { roundToSix } from '@app/common/utils/number.format.util';

export class TradeGetResponseDto {
  tradeId: string;
  orderType: OrderType;
  coinCode: string;
  price: string;
  quantity: number;
  totalAmount: string;
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
    const priceNum = Number(price);
    this.price = priceNum.toFixed(0);
    this.quantity = roundToSix(Number(quantity));
    this.totalAmount = (priceNum * this.quantity).toFixed(0);
    this.tradedAt = tradedAt;
  }
}
