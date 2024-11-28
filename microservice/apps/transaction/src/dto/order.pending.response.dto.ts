import { OrderPendingDto } from './order.pending.dto';

export class OrderPendingResponseDto {
  nextId?: number | null;
  orders: OrderPendingDto[];
  constructor(nextId: number, orders: OrderPendingDto[]) {
    this.nextId = nextId;
    this.orders = orders;
  }
}
