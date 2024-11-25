export interface RecordType {
  date: string;
  price: number;
  amount: number;
  tradePrice: number;
  gradient: 'POSITIVE' | 'NEGATIVE';
}
