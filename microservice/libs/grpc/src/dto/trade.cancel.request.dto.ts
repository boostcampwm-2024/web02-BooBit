export class TradeCancelRequestDto {
  userId: string;
  coinCode: string;
  price: string;
  remain: string;
  orderType: string;

  constructor(
    userId: string,
    coinCode: string,
    price: string,
    remain: string,
    orderType: string,
  ) {
    this.userId = userId;
    this.coinCode = coinCode;
    this.price = price;
    this.remain = remain;
    this.orderType = orderType;
  }
}
