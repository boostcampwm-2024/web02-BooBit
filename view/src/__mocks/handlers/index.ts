import { transactionHandlers } from './transactionHandlers.ts';
import { balanceHandlers } from './balanceHandlers.ts';

export const handlers = [...transactionHandlers, ...balanceHandlers];
