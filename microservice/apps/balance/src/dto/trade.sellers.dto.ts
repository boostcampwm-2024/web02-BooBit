export class TradeSellersDto {
  userId: string;
  coinCode: string;
  tradePayment: number;
  soldCoins: number;

  constructor(
    userId: string,
    coinCode: string,
    tradePayment: number,
    soldCoins: number,
  ) {
    this.userId = userId;
    this.coinCode = coinCode;
    this.tradePayment = tradePayment;
    this.soldCoins = soldCoins;
  }

  add(tradePayment: number, soldCoins: number) {
    this.tradePayment += tradePayment;
    this.soldCoins += soldCoins;
  }
}
