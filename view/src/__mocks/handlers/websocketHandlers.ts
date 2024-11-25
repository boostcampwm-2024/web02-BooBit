import { ws } from 'msw';
import { RecordType } from '../../shared/types/RecordType';
import { BuyAndSellType } from '../../shared/types/socket/BuyAndSellType';

const websocket = ws.link('ws://localhost:3200/ws');

export default [
  websocket.addEventListener('connection', ({ client }) => {
    console.log('클라이언트가 WebSocket에 연결되었습니다.');

    // 첫 데이터 전송
    client.send(
      JSON.stringify({
        event: 'TRADE',
        data: [generateTradeData()],
      })
    );
    // 둘이 충돌나면 하나만 됨
    //client.send(JSON.stringify(generateBuyAndSellData()));

    const tradeInterval = setInterval(() => {
      client.send(
        JSON.stringify({
          event: 'TRADE',
          data: [generateTradeData(), generateTradeData()],
        })
      );
    }, 1000);
    const buyAndSellInterval = setInterval(() => {
      client.send(JSON.stringify(generateBuyAndSellData()));
    }, 3000);

    // 연결이 닫히면 interval 정리
    client.addEventListener('close', () => {
      console.log('클라이언트 연결 종료');
      clearInterval(tradeInterval);
      clearInterval(buyAndSellInterval);
    });
  }),
];

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

function generateBuyAndSellData(): BuyAndSellType {
  const createOrder = () => ({
    price: parseFloat((Math.random() * 490 + 10).toFixed(2)),
    priceChangeRate: parseFloat((Math.random() * 10 - 5).toFixed(2)),
    amount: parseFloat((Math.random() * 99.9 + 0.1).toFixed(2)),
  });

  return {
    event: 'BUY_AND_SELL',
    data: {
      sell: Array.from({ length: Math.floor(Math.random() * 6) }, createOrder),
      buy: Array.from({ length: Math.floor(Math.random() * 6) }, createOrder),
    },
  };
}
