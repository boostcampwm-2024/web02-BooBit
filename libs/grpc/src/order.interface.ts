import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { OrderResponseDto } from '@app/grpc/dto/order.response.dto';
import { Observable } from 'rxjs';
export interface OrderService {
  makeBuyOrder(buyOrderRequest: OrderRequestDto): Observable<OrderResponseDto>;
  makeSellOrder(buyOrderRequest: OrderRequestDto): Observable<OrderResponseDto>;
}
