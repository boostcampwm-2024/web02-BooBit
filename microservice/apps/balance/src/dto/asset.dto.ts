import { CurrencyCodeName } from '@app/common';

export class AssetDto {
  currencyCode: string;
  name: string;
  amount: number;

  constructor(currencyCode: string, amount: number) {
    this.currencyCode = currencyCode;
    this.name = CurrencyCodeName[currencyCode];
    this.amount = amount;
  }
}
