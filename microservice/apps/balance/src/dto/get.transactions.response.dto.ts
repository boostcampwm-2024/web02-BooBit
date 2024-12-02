export class TransactionDto {
  tx_type: string;
  amount: number;
  currency_code: string;
  timestamp: string;
}

export class TransactionResponseDto {
  nextId: number | null;
  transactions: TransactionDto[];
}
