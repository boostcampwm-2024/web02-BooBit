export interface TradeType {
  tradeId: string;
  orderType: 'BUY' | 'SELL';
  coinCode: string;
  quantity: string;
  price: string;
  totalAmount: string;
  tradedAt: string;
}
