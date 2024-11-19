export interface CurrentPriceType {
  event: 'CURRENT_PRICE';
  data: {
    price: number;
    priceChangeAmount: number;
    priceChangeRate: number;
  };
}
