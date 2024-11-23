export class TradeSellerRequestDto {
  userId: string;
  receivedAmount: number;
  coinCode: string;
  soldCoins: number;

  constructor(
    userId: string,
    coinCode: string,
    tradePrice: number,
    quantity: number,
  ) {
    this.userId = userId;
    this.coinCode = coinCode;
    this.receivedAmount = tradePrice * quantity;
    this.soldCoins = quantity;
  }
}
