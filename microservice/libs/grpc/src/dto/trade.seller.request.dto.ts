export class TradeSellerRequestDto {
  userId: string;
  coinCode: string;
  tradePrice: string;
  soldCoins: string;

  constructor(
    userId: string,
    coinCode: string,
    tradePrice: string,
    quantity: string,
  ) {
    this.userId = userId;
    this.coinCode = coinCode;
    this.tradePrice = tradePrice;
    this.soldCoins = quantity;
  }
}
