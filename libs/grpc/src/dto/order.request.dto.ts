import { OrderLimitRequestDto } from 'apps/transaction/src/dto/order.limit.request.dto';

export class OrderRequestDto {
  userId: number;
  coinCode: string;
  amount: number;
  price: number;

  constructor(userId: number, orderLimitRequest: OrderLimitRequestDto) {
    this.userId = userId;
    this.coinCode = orderLimitRequest.coinCode;
    this.amount = orderLimitRequest.amount;
    this.price = orderLimitRequest.price;
  }
}
