import { useEffect, useState } from 'react';
import Chart from '../../entities/Chart';
import OrderBook from '../../entities/OrderBook';
import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';
import OrderPanel from '../../entities/OrderPanel';
import TradeRecords from '../../entities/TradeRecords';
import TimeScaleSelector from './UI/TimeScaleSelector';
import Title from './UI/Title';

import currentPriceMockData from './consts/currentPriceMockData';
import orderBookMockData from './consts/orderBookMockData';

import { ChartTimeScaleType } from '../../shared/types/ChartTimeScaleType';
import useWebSocket from '../../shared/model/useWebSocket';
import { RecordType } from '../../shared/types/RecordType';
import { CandleData } from '../../entities/Chart/model/candleDataType';

const Home = () => {
  const [candleData, setCandleData] = useState<CandleData[]>();
  const [tradeRecords, setTradeRecords] = useState<RecordType[]>();
  const [selectedTimeScale, setSelectedTimeScale] = useState<ChartTimeScaleType>('1sec');

  const { message, sendMessage } = useWebSocket('ws://localhost:3200/ws');
  const [orderPrice, setOrderPrice] = useState<string>(
    orderBookMockData.buy[orderBookMockData.buy.length - 1].price.toLocaleString()
  );

  useEffect(() => {
    if (!message) return;
    switch (message.event) {
      case 'CANDLE_CHART_INIT': {
        const candlePrevData = message.data;

        const transformedData = candlePrevData.map((item) => ({
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
      case 'TRADE': {
        const tradePrevData = message.data;

        setTradeRecords(tradePrevData);
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
  }, [selectedTimeScale]);

  return (
    <div>
      <Header />
      <Layout paddingX="px-[22vw]" flex={false}>
        <Title currentPrice={currentPriceMockData} />
        <TimeScaleSelector
          selectedTimeScale={selectedTimeScale}
          setSelectedTimeScale={setSelectedTimeScale}
        />
        <Chart data={candleData} scaleType={selectedTimeScale} />

        <div className="w-full flex flex-wrap justify-between py-[0.75rem] overflow-hidden">
          <OrderBook
            priceChangeRate={currentPriceMockData.priceChangeRate}
            setOrderPrice={setOrderPrice}
            orderBook={orderBookMockData}
          />
          <OrderPanel tradePrice={orderPrice} setTradePrice={setOrderPrice} />
        </div>

        <TradeRecords tradeRecords={tradeRecords} />
      </Layout>
    </div>
  );
};

export default Home;
