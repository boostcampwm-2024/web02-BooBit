export type OrderType = {
  historyId: number;
  createdAt: string;
  orderType: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  unfilledAmount: number;
};
