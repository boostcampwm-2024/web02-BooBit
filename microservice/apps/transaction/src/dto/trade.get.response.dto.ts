import { OrderType } from '@app/common/enums/order-type.enum';

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
    this.price = Number(price);
    this.quantity = Number(quantity);
    this.totalAmount = this.price * this.quantity;
    this.tradedAt = tradedAt;
  }
}
