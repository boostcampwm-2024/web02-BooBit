export interface TradeType {
  event: 'TRADE';
  data: {
    date: string;
    price: number;
    amount: number;
    tradePrice: number;
    gradient: 'POSITIVE' | 'NEGATIVE';
  };
}
