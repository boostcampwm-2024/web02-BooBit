import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// websocket

export const worker = setupWorker(...handlers);
