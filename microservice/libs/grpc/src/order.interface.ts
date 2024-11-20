import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { OrderResponseDto } from '@app/grpc/dto/order.response.dto';
export interface OrderService {
  makeBuyOrder(buyOrderRequest: OrderRequestDto): Promise<OrderResponseDto>;
  makeSellOrder(buyOrderRequest: OrderRequestDto): Promise<OrderResponseDto>;
}
