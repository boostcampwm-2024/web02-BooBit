import { BuyAndSellType } from './BuyAndSellType';
import { CandleChartType } from './CandleChartType';
import { TradeType } from './TradeType';

export type WebSocketMessage = CandleChartType | BuyAndSellType | TradeType;
