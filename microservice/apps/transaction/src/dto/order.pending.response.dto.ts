import { OrderType } from '@app/common/enums/order-type.enum';
import { roundToSix } from '@app/common/utils/number.format.util';

export class OrderPendingResponseDto {
  historyId: string;
  orderType: OrderType;
  coinCode: string;
  price: string;
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
    this.price = Number(price).toFixed(0);
    this.quantity = roundToSix(Number(quantity));
    this.unfilledAmount = roundToSix(Number(unfilledAmount));
    this.createdAt = createdAt;
  }
}
