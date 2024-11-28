export class TradeBuyerRequestDto {
  userId: string;
  coinCode: string;
  buyerPice: string;
  tradePice: string;
  receivedCoins: string;

  constructor(
    userId: string,
    coinCode: string,
    buyerPrice: string,
    tradePrice: string,
    quantity: string,
  ) {
    this.userId = userId;
    this.coinCode = coinCode;
    this.buyerPice = buyerPrice;
    this.tradePice = tradePrice;
    this.receivedCoins = quantity;
  }
}
