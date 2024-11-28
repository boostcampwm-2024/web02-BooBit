export class TradeSellerRequestDto {
  userId: string;
  coinCode: string;
  tradePice: string;
  soldCoins: string;

  constructor(
    userId: string,
    coinCode: string,
    tradePrice: string,
    quantity: string,
  ) {
    this.userId = userId;
    this.coinCode = coinCode;
    this.tradePice = tradePrice;
    this.soldCoins = quantity;
  }
}
