export interface OrderType {
  orderType: 'BUY' | 'SELL';
  coinCode: string;
  quantity: string;
  price: string;
  status: 'PARTIALLY_FILLED' | 'FILLED' | 'PARTIALLY_CANCELED' | 'CANCELED';
  timestamp: string;
}
