import Decimal from 'decimal.js';

export type asset = {
  currency_code: string;
  currency: { name: string };
  available_balance: Decimal;
  locked_balance: Decimal;
};
