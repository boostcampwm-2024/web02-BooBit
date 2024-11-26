import { OrderType } from '@app/common/enums/order-type.enum';

export class OrderPendingResponseDto {
  historyId: string;
  orderType: OrderType;
  coinCode: string;
  price: number;
  quantity: number;
  unfilledAmount: number;
  createdAt: Date;

  constructor(
    historyId: string,
    orderType: OrderType,
    coinCode: string,
    price: string,
    quantity: string,
    unfilledAmount: string,
    createdAt: Date,
  ) {
    this.historyId = historyId;
    this.orderType = orderType;
    this.coinCode = coinCode;
    this.price = Number(price);
    this.quantity = Number(quantity);
    this.unfilledAmount = Number(unfilledAmount);
    this.createdAt = createdAt;
  }
}
