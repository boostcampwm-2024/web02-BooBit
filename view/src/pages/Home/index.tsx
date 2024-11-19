import { useEffect, useState } from 'react';
import Chart from '../../entities/Chart';
import OrderBook from '../../entities/OrderBook';
import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';
import d1candleData from './consts/d1candleData';
import TimeScaleSelector from './UI/TimeScaleSelector';
import Title from './UI/Title';

import generateCandleData from './lib/generateCandleData';
import { ChartTimeScaleType } from '../../shared/types/ChartTimeScaleType';
import currentPriceMockData from './consts/currentPriceMockData';
import orderBookMockData from './consts/orderBookMockData';

const timeScaleMap = {
  '1s': 1000,
  '1m': 60000,
  '10m': 600000,
  '30m': 1800000,
  '1h': 3600000,
  '1d': 86400000,
  '1w': 604800000,
  '1M': 2592000000,
};

const Home = () => {
  const [candleData, setCandleData] = useState(d1candleData);
  const [selectedTimeScale, setSelectedTimeScale] = useState<ChartTimeScaleType>('1d'); // 타입 지정
  const [orderPrice, setOrderPrice] = useState<number>(
    orderBookMockData.buy[orderBookMockData.buy.length - 1].price
  );

  useEffect(() => {
    const baseDate = new Date('2024-01-01T10:00:00');
    const newData = generateCandleData(baseDate, timeScaleMap[selectedTimeScale], 60);
    setCandleData(newData);
  }, [selectedTimeScale]);

  const handleButtonClick = () => {
    setCandleData((prevData) => {
      const lastDate = prevData[prevData.length - 1].date; // 마지막 데이터의 날짜
      const newBaseDate = new Date(lastDate.getTime() + timeScaleMap[selectedTimeScale]); // 다음 캔들의 시작 날짜

      return [
        ...prevData.slice(5),
        ...generateCandleData(newBaseDate, timeScaleMap[selectedTimeScale], 5),
      ];
    });
  };
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
        <button onClick={handleButtonClick}>Generate More Data</button>
        <OrderBook
          priceChangeRate={currentPriceMockData.priceChangeRate}
          setOrderPrice={setOrderPrice}
          orderBook={orderBookMockData}
        />
      </Layout>
    </div>
  );
};

export default Home;
