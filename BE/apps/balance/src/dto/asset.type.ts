import { Decimal } from '@prisma/client/runtime/library';

export type asset = {
  currency_code: string;
  available_balance: Decimal;
  locked_balance: Decimal;
};
