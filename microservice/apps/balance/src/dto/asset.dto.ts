import { CurrencyCodeName } from '@app/common';
import { roundToSix } from '@app/common/utils/number.format.util';

export class AssetDto {
  currencyCode: string;
  name: string;
  amount: number;

  constructor(currencyCode: string, amount: number) {
    this.currencyCode = currencyCode;
    this.name = CurrencyCodeName[currencyCode];
    this.amount = roundToSix(amount);
  }
}
