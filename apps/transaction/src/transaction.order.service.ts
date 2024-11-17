import { OrderRequestDto } from '@app/grpc/dto/order.request.dto';
import { OrderResponseDto } from '@app/grpc/dto/order.response.dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface OrderService {
  makeBuyOrder(buyOrderRequest: OrderRequestDto): Observable<OrderResponseDto>;
  makeSellOrder(buyOrderRequest: OrderRequestDto): Observable<OrderResponseDto>;
}

@Injectable()
export class TransactionOrderService implements OnModuleInit {
  private orderService: OrderService;
  constructor(@Inject('ORDER_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.orderService = this.client.getService<OrderService>('OrderService');
  }

  makeBuyOrder(orderRequest: OrderRequestDto): Observable<OrderResponseDto> {
    return this.orderService.makeBuyOrder(orderRequest);
  }

  makeSellOrder(orderRequest: OrderRequestDto): Observable<OrderResponseDto> {
    return this.orderService.makeSellOrder(orderRequest);
  }
}
