export class OrderItemDto {
  price: number;
  priceChangeRate: number;
  amount: number;
}

export class OrderBookDto {
  sell: OrderItemDto[];
  buy: OrderItemDto[];
}
