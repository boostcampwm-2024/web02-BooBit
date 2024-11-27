export class OrderLimitRequestDto {
  constructor(coinCode: string, amount: number, price: number) {
    this.coinCode = coinCode;
    this.amount = amount;
    this.price = price;
  }
  coinCode: string;
  amount: number;
  price: number;
}
