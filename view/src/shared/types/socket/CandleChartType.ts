import { CandleSocketType } from './CandleSocketType';

export interface CandleChartType {
  event: 'CANDLE_CHART' | 'CANDLE_CHART_INIT';
  timeScale: '1sec' | '1min' | '15min' | '30min' | '1hour' | '1day' | '1year';
  data: CandleSocketType[];
}
