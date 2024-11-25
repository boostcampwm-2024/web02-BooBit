import { transactionHandlers } from './transactionHandlers.ts';
import { balanceHandlers } from './balanceHandlers.ts';
import websocketHandlers from './websocketHandlers.ts';

export const handlers = [...transactionHandlers, ...balanceHandlers, ...websocketHandlers];
