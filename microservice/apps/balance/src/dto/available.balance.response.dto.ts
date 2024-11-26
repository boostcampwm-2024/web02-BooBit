export class AvailableBalanceResponseDto {
  available_balance: number;
  currency_code: string;

  constructor(availableBalance: number, currencyCode: string) {
    this.available_balance = availableBalance;
    this.currency_code = currencyCode;
  }
}
