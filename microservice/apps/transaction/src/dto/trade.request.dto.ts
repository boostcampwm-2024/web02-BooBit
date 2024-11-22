import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { OrderResponseDto } from '@app/grpc/dto/order.response.dto';

export class TradeRequestDto {
  historyId: string;
  userId: string;
  coinCode: string;
  amount: number;
  price: number;
  status: string;

  constructor(orderRequest: OrderRequestDto, orderResponse: OrderResponseDto) {
    this.historyId = orderResponse.historyId;
    this.userId = orderRequest.userId;
    this.coinCode = orderRequest.coinCode;
    this.amount = orderRequest.amount;
    this.price = orderRequest.price;
    this.status = orderResponse.status;
  }
}
