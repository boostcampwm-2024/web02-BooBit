import axios from 'axios';
import { UpbitResponse } from './upbit.response.dto';

export async function getUpbitPrice(): Promise<number> {
  try {
    const response = await axios.get<UpbitResponse[]>(
      'https://api.upbit.com/v1/ticker?markets=KRW-BTC',
    );

    const tradePrice = response.data[0].trade_price;
    const currentTime = new Date().toLocaleTimeString();

    console.log(
      `[${currentTime}] Current Upbit Bitcoin Price: ${tradePrice.toLocaleString('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      })}`,
    );
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
export async function getBoobitPrice(): Promise<number> {
  try {
    const response = await axios.get<number>('http://boobit.xyz/api/orders/price');
    const tradePrice = response.data;
    const currentTime = new Date().toLocaleTimeString();

    console.log(
      `[${currentTime}] Current Boobit Bitcoin Price: ${tradePrice.toLocaleString('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      })}`,
    );
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
