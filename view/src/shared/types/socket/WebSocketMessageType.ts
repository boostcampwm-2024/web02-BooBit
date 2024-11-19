import { BuyAndSellType } from './BuyAndSellType';
import { CandleChartType } from './CandleChartType';
import { CurrentPriceType } from './CurrentPriceType';
import { TradeType } from './TradeType';

export type WebSocketMessage = CurrentPriceType | CandleChartType | BuyAndSellType | TradeType;
