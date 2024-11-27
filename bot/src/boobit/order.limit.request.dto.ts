export class OrderLimitRequestDto {
  constructor(coinCode: string, amount: number, price: number) {
    this.coinCode = coinCode;
    this.amount = amount;
    this.price = price;
  }
  coinCode: string;
  amount: number;
  price: number;

  toString() {
    return `OrderLimitRequestDto { coinCode: ${this.coinCode}, amount: ${
      this.amount
    }, price: ${this.price.toLocaleString('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    })} }`;
  }
}
