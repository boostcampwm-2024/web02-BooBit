export class TradeCancelRequestDto {
  userId: string;
  historyId: string;
  coinCode: string;
  price: string;
  remain: string;
  orderType: string;

  constructor(
    userId: string,
    historyId: string,
    coinCode: string,
    price: string,
    remain: string,
    orderType: string,
  ) {
    this.userId = userId;
    this.historyId = historyId;
    this.coinCode = coinCode;
    this.price = price;
    this.remain = remain;
    this.orderType = orderType;
  }
}
