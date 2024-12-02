export interface RecordType {
  tradeId: string;
  date: string;
  price: number;
  amount: number;
  tradePrice: number;
  gradient: 'POSITIVE' | 'NEGATIVE';
}
