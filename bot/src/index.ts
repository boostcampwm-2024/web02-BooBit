import { getBitcoinPrice } from './upbit/upbit.index';

setInterval(getBitcoinPrice, 1000);
