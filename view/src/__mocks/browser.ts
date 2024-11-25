import { setupWorker } from 'msw/browser';
import { ws } from 'msw';
import { handlers } from './handlers';

// http
//export const worker = setupWorker(...handlers);

// websocket
export interface RecordType {
  date: string;
  price: number;
  amount: number;
  tradePrice: number;
  gradient: 'POSITIVE' | 'NEGATIVE';
}

function generateTradeData(): RecordType {
  const now = new Date();
  const price = parseFloat((Math.random() * 1000 + 100).toFixed(2)); // 100~1100 사이 랜덤 가격
  const amount = parseFloat((Math.random() * 10).toFixed(4)); // 0~10 사이 랜덤 코인량
  const tradePrice = parseFloat((price * amount).toFixed(2));
  const gradient = Math.random() > 0.5 ? 'POSITIVE' : 'NEGATIVE';

  return {
    date: now.toISOString(),
    price,
    amount,
    tradePrice,
    gradient,
  };
}

const websocket = ws.link('ws://localhost:3200/ws');

export const worker = setupWorker(
  ...handlers,
  websocket.addEventListener('connection', ({ client }) => {
    console.log('클라이언트가 WebSocket에 연결되었습니다.');

    // 첫 데이터 전송
    client.send(
      JSON.stringify({
        event: 'TRADE',
        data: [generateTradeData()],
      })
    );

    const intervalId = setInterval(() => {
      client.send(
        JSON.stringify({
          event: 'TRADE',
          data: [generateTradeData(), generateTradeData()],
        })
      );
    }, 1000);

    // 연결이 닫히면 interval 정리
    client.addEventListener('close', () => {
      console.log('클라이언트 연결 종료');
      clearInterval(intervalId);
    });
  })
);
