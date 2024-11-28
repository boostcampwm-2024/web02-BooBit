import { OrderType } from '@app/common/enums/order-type.enum';
import { roundToSix, roundToZero } from '@app/common/utils/number.format.util';

export class OrderPendingDto {
  historyId: number;
  orderType: OrderType;
  price: number;
  quantity: number;
  unfilledAmount: number;
  createdAt: string;

  constructor(
    historyId: string,
    orderType: OrderType,
    price: string,
    quantity: string,
    unfilledAmount: string,
    createdAt: string,
  ) {
    this.historyId = Number(historyId);
    this.orderType = orderType;
    this.price = roundToZero(Number(price));
    this.quantity = roundToSix(Number(quantity));
    this.unfilledAmount = roundToSix(Number(unfilledAmount));
    this.createdAt = createdAt;
  }
}
