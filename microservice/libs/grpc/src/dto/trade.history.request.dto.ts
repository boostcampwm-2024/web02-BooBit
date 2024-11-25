export class TradeHistoryRequestDto {
  historyId: string;
  remain: number;

  constructor(historyId: string, remain: number) {
    this.historyId = historyId;
    this.remain = remain;
  }
}
