import { OrderType } from '@app/common/enums/order-type.enum';

export class OrderPendingResponseDto {
  historyId: string;
  orderType: OrderType;
  coinCode: string;
  price: string;
  quantity: string;
  unfilledAmount: string;
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
    this.price = price;
    this.quantity = quantity;
    this.unfilledAmount = unfilledAmount;
    this.createdAt = createdAt;
  }
}
