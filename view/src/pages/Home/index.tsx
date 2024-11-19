import { useEffect, useState } from 'react';
import Chart from '../../entities/Chart';
import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';
import TimeScaleSelector from './UI/TimeScaleSelector';
import OrderPanel from '../../entities/OrderPanel';

import d1candleData from './consts/d1candleData';
import { ChartTimeScaleType } from '../../shared/types/ChartTimeScaleType';
import useWebSocket from '../../shared/model/useWebSocket';

const Home = () => {
  const [candleData, setCandleData] = useState(d1candleData);
  const [selectedTimeScale, setSelectedTimeScale] = useState<ChartTimeScaleType>('1day');
  const [tradePrice, setTradePrice] = useState('128,368,000');

  const { message, sendMessage } = useWebSocket('ws://172.31.99.241:3000/ws');

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
        <TimeScaleSelector
          selectedTimeScale={selectedTimeScale}
          setSelectedTimeScale={setSelectedTimeScale}
        />
        <Chart data={candleData} scaleType={selectedTimeScale} />
        <div className="w-full flex justify-between py-[0.75rem] overflow-hidden">
          <OrderPanel tradePrice={tradePrice} setTradePrice={setTradePrice} />
        </div>
      </Layout>
    </div>
  );
};

export default Home;
