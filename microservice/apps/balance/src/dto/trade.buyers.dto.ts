export class TradeBuyersDto {
  userId: string;
  coinCode: string;
  originalPayment: number;
  refund: number;
  receivedCoins: number;

  constructor(
    userId: string,
    coinCode: string,
    originalPayment: number,
    refund: number,
    receivedCoins: number,
  ) {
    this.userId = userId;
    this.coinCode = coinCode;
    this.originalPayment = originalPayment;
    this.refund = refund;
    this.receivedCoins = receivedCoins;
  }

  add(originalPayment: number, refund: number, receivedCoins: number) {
    this.originalPayment += originalPayment;
    this.refund += refund;
    this.receivedCoins += receivedCoins;
  }
}
