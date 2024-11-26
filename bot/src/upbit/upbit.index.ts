import axios from 'axios';
import { UpbitResponse } from './upbit.response.dto';

export async function getBitcoinPrice(): Promise<number> {
  try {
    const response = await axios.get<UpbitResponse[]>(
      'https://api.upbit.com/v1/ticker?markets=KRW-BTC',
    );

    const tradePrice = response.data[0].trade_price;
    const currentTime = new Date().toLocaleTimeString();

    console.log(`[${currentTime}] Current Bitcoin Price: ${tradePrice.toLocaleString()} KRW`);
    return tradePrice;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching Bitcoin price:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}
