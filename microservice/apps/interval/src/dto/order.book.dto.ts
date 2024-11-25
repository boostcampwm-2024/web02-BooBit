export class OrderItemDto {
  price: number;
  priceChangeRate: number;
  amount: number;
}

export class OrderBookDto {
  currentPrice: number;
  sell: OrderItemDto[];
  buy: OrderItemDto[];
}
