import { useEffect, useState } from 'react';
import Chart from '../../entities/Chart';
import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';
import OrderPanel from '../../entities/OrderPanel';
import OrderBook from '../../entities/OrderBook';
import TradeRecords from '../../entities/TradeRecords';
import TimeScaleSelector from './UI/TimeScaleSelector';
import Title from './UI/Title';

import { ChartTimeScaleType } from '../../shared/types/ChartTimeScaleType';
import { RecordType } from '../../shared/types/RecordType';
import { CandleData } from '../../entities/Chart/model/candleDataType';
import { OrderType } from '../../shared/types/socket/OrderType';
import { CandleSocketType } from '../../shared/types/socket/CandleSocketType';

const socketUrl = import.meta.env.VITE_SOCKET_URL;

const Home = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [candleData, setCandleData] = useState<CandleData[]>();
  const [tradeRecords, setTradeRecords] = useState<RecordType[]>();
  const [orderBookData, setOrderBookData] = useState<{ buy: OrderType[]; sell: OrderType[] }>();
  const [selectedTimeScale, setSelectedTimeScale] = useState<ChartTimeScaleType>('1sec');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [orderPrice, setOrderPrice] = useState<string>('');

  const hasIncreased = false;

  // WebSocket 연결 및 메시지 처리
  useEffect(() => {
    const ws = new WebSocket(socketUrl);
    setSocket(ws);

    ws.onopen = () => {
      console.log('웹소켓 연결 완료');
    };

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);

      switch (receivedData.event) {
        case 'CANDLE_CHART_INIT': {
          const candlePrevData = receivedData.data.map((item: CandleSocketType) => ({
            date: new Date(item.date),
            open: item.open,
            close: item.close,
            high: item.high,
            low: item.low,
            volume: item.volume,
          }));
          setCandleData(candlePrevData);
          break;
        }
        case 'CANDLE_CHART': {
          const candleData = receivedData.data.map((item: CandleSocketType) => ({
            date: new Date(item.date),
            open: item.open,
            close: item.close,
            high: item.high,
            low: item.low,
            volume: item.volume,
          }));

          if (candleData.length === 1) {
            const [currentCandle] = candleData;

            setCandleData((prevCandleData) => {
              if (!prevCandleData) {
                return [currentCandle];
              }

              const updatedData = [...prevCandleData];
              updatedData[updatedData.length - 1] = currentCandle;
              return updatedData;
            });
          } else {
            const [prevCandle, currentCandle] = candleData;

            setCandleData((prevCandleData) => {
              if (!prevCandleData) {
                return [...candleData];
              }

              const updatedData = [...prevCandleData];
              updatedData.shift();
              updatedData[updatedData.length - 1] = prevCandle;

              return [...updatedData, currentCandle];
            });
          }
          break;
        }
        case 'TRADE': {
          const tradePrevData = receivedData.data;

          if (!tradeRecords && tradePrevData && tradePrevData.length > 0) {
            setOrderPrice(tradePrevData[0].price.toLocaleString());
          }
          if (tradePrevData && tradePrevData.length > 0) {
            setCurrentPrice(tradePrevData[0].price);
          }
          setTradeRecords((prevRecords) => {
            return prevRecords ? [...tradePrevData, ...prevRecords] : [...tradePrevData];
          });
          break;
        }
        case 'BUY_AND_SELL': {
          const nowOrderBookData = receivedData.data;
          setOrderBookData(nowOrderBookData);
          break;
        }
        default:
          break;
      } // 서버에서 받은 데이터를 상태에 저장
    };

    // WebSocket 연결 종료 시
    return () => {
      ws.close();
    };
  }, []);

  // 시간 단위 변경 시 WebSocket 초기화 메시지 전송
  useEffect(() => {
    const initMessage = {
      event: 'CANDLE_CHART_INIT',
      timeScale: selectedTimeScale,
    };
    if (socket) {
      socket.send(JSON.stringify(initMessage));
    }
    setTradeRecords([]);
  }, [selectedTimeScale, socket]);

  return (
    <div>
      <Header />
      <Layout paddingX="px-[22vw]" flex={false}>
        <Title currentPrice={currentPrice} hasIncreased={hasIncreased} />
        <TimeScaleSelector
          selectedTimeScale={selectedTimeScale}
          setSelectedTimeScale={setSelectedTimeScale}
        />
        {candleData ? (
          <Chart data={candleData} scaleType={selectedTimeScale} />
        ) : (
          <div className="h-[460px] bg-surface-default"></div>
        )}

        <div className="w-full flex flex-wrap justify-between py-[0.75rem] overflow-hidden">
          <OrderBook
            currentPrice={currentPrice}
            hasIncreased={hasIncreased}
            setOrderPrice={setOrderPrice}
            orderBook={orderBookData}
          />
          <OrderPanel tradePrice={orderPrice} setTradePrice={setOrderPrice} />
        </div>

        <TradeRecords tradeRecords={tradeRecords} />
      </Layout>
    </div>
  );
};

export default Home;
