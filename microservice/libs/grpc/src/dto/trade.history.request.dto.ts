export class TradeHistoryRequestDto {
  historyId: string;
  userId: string;
  remain: number;

  constructor(historyId: string, userId: string, remain: number) {
    this.historyId = historyId;
    this.userId = userId;
    this.remain = remain;
  }
}
