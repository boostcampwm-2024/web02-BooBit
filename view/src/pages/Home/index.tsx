import { useEffect, useRef, useState } from 'react';
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
import formatPrice from '../../shared/model/formatPrice';

const socketUrl = import.meta.env.VITE_SOCKET_URL;
const MAX_RECORDS = 200;
const REMOVE_COUNT = 30;

const Home = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const messageQueue: string[] = [];

  const [candleData, setCandleData] = useState<CandleData[]>();
  const [tradeRecords, setTradeRecords] = useState<RecordType[]>();
  const [orderBookData, setOrderBookData] = useState<{ buy: OrderType[]; sell: OrderType[] }>();
  const [selectedTimeScale, setSelectedTimeScale] = useState<ChartTimeScaleType>('1sec');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [lastDayClose, setLastDayClose] = useState(0);
  const [orderPrice, setOrderPrice] = useState<string>('');

  const isFirstTradeProcessed = useRef(false);

  const hasIncreased = false;

  // WebSocket 연결 및 메시지 처리
  useEffect(() => {
    const ws = new WebSocket(socketUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('웹소켓 연결 완료');
      while (messageQueue.length > 0) {
        ws.send(messageQueue.shift()!);
      }
    };

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);

      switch (receivedData.event) {
        case 'CANDLE_CHART_INIT': {
          const candlePrevData = receivedData.data;
          setLastDayClose(receivedData.lastDayClose);
          setCandleData(candlePrevData);
          break;
        }
        case 'CANDLE_CHART': {
          const candleData = receivedData.data;

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

          // 첫 번째 TRADE 이벤트에서만 실행
          if (!isFirstTradeProcessed.current && tradePrevData && tradePrevData.length > 0) {
            setOrderPrice(formatPrice(tradePrevData[0].price));
            isFirstTradeProcessed.current = true; // 첫 번째 처리 완료
          }

          if (tradePrevData && tradePrevData.length > 0) {
            setCurrentPrice(tradePrevData[0].price);
          }

          setTradeRecords((prevRecords) => {
            const updatedRecords = prevRecords
              ? [...tradePrevData, ...prevRecords]
              : [...tradePrevData];

            if (updatedRecords.length > MAX_RECORDS) {
              return updatedRecords.slice(0, MAX_RECORDS - REMOVE_COUNT);
            }

            return updatedRecords;
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
      }
    };

    // WebSocket 연결 종료 시
    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, []);

  const sendMessage = (message: object) => {
    const serializedMessage = JSON.stringify(message);
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(serializedMessage);
    } else {
      messageQueue.push(serializedMessage);
    }
  };

  useEffect(() => {
    sendMessage({
      event: 'CANDLE_CHART_INIT',
      timeScale: selectedTimeScale,
    });
    setTradeRecords([]);
  }, [selectedTimeScale]);

  useEffect(() => {}, [lastDayClose, currentPrice]);

  return (
    <div>
      <Header />
      <Layout paddingX="px-[22vw]" flex={false}>
        <Title currentPrice={currentPrice} lastDayClose={lastDayClose} />
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
