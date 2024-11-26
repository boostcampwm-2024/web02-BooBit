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
import useWebSocket from '../../shared/model/useWebSocket';
import { RecordType } from '../../shared/types/RecordType';
import { CandleData } from '../../entities/Chart/model/candleDataType';
import { CandleSocketType } from '../../shared/types/socket/CandleSocketType';
import { OrderType } from '../../shared/types/socket/OrderType';

const socketUrl = import.meta.env.VITE_SOCKET_URL;
const Home = () => {
  const { message, sendMessage } = useWebSocket(socketUrl);
  const [candleData, setCandleData] = useState<CandleData[]>();
  const [tradeRecords, setTradeRecords] = useState<RecordType[]>();
  const [orderBookData, setOrderBookData] = useState<{ buy: OrderType[]; sell: OrderType[] }>();
  const [selectedTimeScale, setSelectedTimeScale] = useState<ChartTimeScaleType>('1sec');
  const [currentPrice, setCurrentPrice] = useState(0);

  const hasIncreased = false;
  const [orderPrice, setOrderPrice] = useState<string>('');

  useEffect(() => {
    if (!message) return;
    switch (message.event) {
      case 'CANDLE_CHART_INIT': {
        const candlePrevData = message.data;

        const transformedData = candlePrevData.map((item: CandleSocketType) => ({
          date: new Date(item.date),
          open: item.open,
          close: item.close,
          high: item.high,
          low: item.low,
          volume: item.volume,
        }));

        setCandleData(transformedData);
        break;
      }
      case 'CANDLE_CHART': {
        const candleData = message.data.map((item: CandleSocketType) => ({
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

            // 마지막 데이터 업데이트
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

            // 이전 데이터 추가 및 현재 데이터 추가
            const updatedData = [...prevCandleData];
            updatedData.shift();
            updatedData[updatedData.length - 1] = prevCandle;

            return [...updatedData, currentCandle];
          });
        }

        break;
      }
      case 'TRADE': {
        const tradePrevData = message.data;

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
        const nowOrderBookData = message.data;

        setOrderBookData(nowOrderBookData);
        break;
      }
      default:
        break;
    }
  }, [message]);

  useEffect(() => {
    const initMessage = {
      event: 'CANDLE_CHART_INIT',
      timeScale: selectedTimeScale,
    };
    sendMessage(JSON.stringify(initMessage));
    setTradeRecords([]);
  }, [selectedTimeScale]);

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
