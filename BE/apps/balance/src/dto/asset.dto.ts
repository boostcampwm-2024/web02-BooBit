import Decimal from 'decimal.js';

export class AssetDto {
  currencyCode: string;
  name: string;
  amount: Decimal;

  constructor(
    currencyCode: string,
    name: string,
    availableBalance: Decimal,
    lockedBalance: Decimal,
  ) {
    this.currencyCode = currencyCode;
    this.name = name;
    this.amount = availableBalance.add(lockedBalance);
  }
}
