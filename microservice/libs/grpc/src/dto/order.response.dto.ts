export class OrderResponseDto {
  status: string;
  historyId: string;

  constructor(status, historyId) {
    this.status = status;
    this.historyId = historyId;
  }
}
