export class OrderRequestDto {
  userId: string;
  coinCode: string;
  amount: number;
  price: number;

  constructor(userId: string, coinCode: string, amount: number, price: number) {
    this.userId = userId;
    this.coinCode = coinCode;
    this.amount = amount;
    this.price = price;
  }
}
