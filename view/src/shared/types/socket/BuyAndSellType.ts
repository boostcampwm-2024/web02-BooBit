export interface BuyAndSellType {
  event: 'BUY_AND_SELL';
  data: {
    currentPrice: number;
    sell: Array<{
      price: number;
      priceChangeRate: number;
      amount: number;
    }>;
    buy: Array<{
      price: number;
      priceChangeRate: number;
      amount: number;
    }>;
  };
}
