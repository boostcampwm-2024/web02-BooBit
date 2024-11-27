export class AvailableBalanceResponseDto {
  availableBalance: number;
  currencyCode: string;

  constructor(availableBalance: number, currencyCode: string) {
    this.availableBalance = availableBalance;
    this.currencyCode = currencyCode;
  }
}
