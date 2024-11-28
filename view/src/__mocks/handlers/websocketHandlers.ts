import { ws } from 'msw';
import { RecordType } from '../../shared/types/RecordType';
import { BuyAndSellType } from '../../shared/types/socket/BuyAndSellType';
import { CandleSocketType } from '../../shared/types/socket/CandleSocketType';

const websocket = ws.link('ws://localhost:3200/ws');

export default [
  websocket.addEventListener('connection', ({ client }) => {
    console.log('클라이언트가 WebSocket에 연결되었습니다.');

    // 첫 데이터 전송
    client.send(
      JSON.stringify({
        event: 'CANDLE_CHART_INIT',
        timeScale: '1min',
        data: generateCandleData(new Date(), 1 * 1000, 50),
      })
    );
    // 충돌나면 하나만 됨
    //client.send(JSON.stringify(generateBuyAndSellData()));

    let lastCandle: CandleSocketType = generateCandle(new Date(), null);
    let timeElapsed = 0;

    const candleInterval = setInterval(() => {
      timeElapsed += 1; // 1초 증가
      const now = new Date();

      // 새로운 캔들 데이터 생성
      const currentCandle = generateCandle(now, lastCandle);

      if (timeElapsed % 3 === 0) {
        // 분기점: 이전 캔들과 현재 캔들 데이터를 전송
        client.send(
          JSON.stringify({
            event: 'CANDLE_CHART',
            timeScale: '1min',
            data: [lastCandle, currentCandle],
          })
        );
      } else {
        // 일반 시점: 현재 캔들 데이터만 전송
        client.send(
          JSON.stringify({
            event: 'CANDLE_CHART',
            timeScale: '1sec',
            data: [currentCandle],
          })
        );
      }

      // 마지막 캔들 업데이트
      lastCandle = currentCandle;
    }, 1000);

    const tradeInterval = setInterval(() => {
      client.send(
        JSON.stringify({
          event: 'TRADE',
          data: [generateTradeData(), generateTradeData()],
        })
      );
    }, 2000);
    const buyAndSellInterval = setInterval(() => {
      client.send(JSON.stringify(generateBuyAndSellData()));
    }, 3000);

    // 연결이 닫히면 interval 정리
    client.addEventListener('close', () => {
      console.log('클라이언트 연결 종료');
      clearInterval(tradeInterval);
      clearInterval(buyAndSellInterval);
      clearInterval(candleInterval);
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
    tradeId: now.toLocaleDateString(),
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

const generateCandleData = (baseDate: Date, interval: number, count: number) => {
  let previousClose = Math.floor(Math.random() * 100 + 100); // 초기 값 설정

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(baseDate.getTime() + index * interval);

    // 현재 캔들 데이터 생성
    const open = previousClose; // 이전 종가를 다음 캔들의 시가로 설정
    const high = open + Math.floor(Math.random() * 10); // 시가보다 높음
    const low = open - Math.floor(Math.random() * 10); // 시가보다 낮음
    const close = Math.floor(Math.random() * (high - low) + low); // 고가와 저가 사이
    const volume = Math.floor(Math.random() * 1000 + 500); // 랜덤 거래량

    // 다음 캔들을 위해 종가 업데이트
    previousClose = close;

    return { date, open, high, low, close, volume };
  });
};

function generateCandle(
  currentDate: Date,
  previousCandle: CandleSocketType | null
): CandleSocketType {
  const open = previousCandle ? previousCandle.close : Math.floor(Math.random() * 100 + 100); // 시가
  const high = open + Math.floor(Math.random() * 10); // 고가
  const low = open - Math.floor(Math.random() * 10); // 저가
  const close = Math.floor(Math.random() * (high - low) + low); // 종가
  const volume = Math.floor(Math.random() * 1000 + 500); // 거래량

  return {
    date: currentDate.toISOString(),
    open,
    close,
    high,
    low,
    volume,
  };
}
