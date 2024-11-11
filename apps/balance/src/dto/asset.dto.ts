import { Decimal } from '@prisma/client/runtime/library';

export class AssetDto {
  currencyCode: string;
  name: string;
  amount: Decimal;

  constructor(
    currencyCode: string,
    availableBalance: Decimal,
    lockedBalance: Decimal,
  ) {
    this.currencyCode = currencyCode;
    this.amount = availableBalance.add(lockedBalance);
  }
}
