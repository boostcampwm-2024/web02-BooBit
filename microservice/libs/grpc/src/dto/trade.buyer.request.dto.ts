export class TradeBuyerRequestDto {
  userId: string;
  coinCode: string;
  buyerPrice: string;
  tradePrice: string;
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
    this.buyerPrice = buyerPrice;
    this.tradePrice = tradePrice;
    this.receivedCoins = quantity;
  }
}
