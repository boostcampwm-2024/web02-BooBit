import { OrderType } from './OrderType';

export interface BuyAndSellType {
  event: 'BUY_AND_SELL';
  data: {
    sell: OrderType[];
    buy: OrderType[];
  };
}
