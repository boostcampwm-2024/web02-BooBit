export class TradeBuyerRequestDto {
  userId: string;
  coinCode: string;
  remainingAmount: number;
  paymentAmount: number;
  receivedCoins: number;
  refund: number;

  constructor(
    userId: string,
    coinCode: string,
    buyerPrice: number,
    tradePrice: number,
    quantity: number,
  ) {
    this.userId = userId;
    this.coinCode = coinCode;
    const payment = tradePrice * quantity;
    this.paymentAmount = payment;
    this.receivedCoins = quantity;
    this.refund = buyerPrice * quantity - payment;
  }
}
