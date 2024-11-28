import { RecordType } from '../RecordType';

export interface TradeType {
  event: 'TRADE';
  data: RecordType[];
}
