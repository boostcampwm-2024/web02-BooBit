export interface OrderType {
  orderType: 'BUY' | 'SELL';
  coinCode: string;
  quantity: string;
  price: string;
  status: 'ORDERED' | 'CANCELED';
  timestamp: string;
}
