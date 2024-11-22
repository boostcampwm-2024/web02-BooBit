import { OrderStatus } from '@app/common/enums/order-status.enum';

export class TradeHistoryRequestDto {
  historyId: string;
  status: OrderStatus;
  remain: number;

  constructor(historyId: string, status: OrderStatus, remain: number) {
    this.historyId = historyId;
    this.status = status;
    this.remain = remain;
  }
}
