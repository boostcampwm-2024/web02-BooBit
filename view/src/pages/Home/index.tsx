import { useState } from 'react';
import Chart from '../../entities/Chart';
import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';
import candleMockData from './consts/candleData';
import generateCandleData from './lib/generateCandleData';
import TimeScaleSelector from './UI/TimeScaleSelector';

const Home = () => {
  const [candleData, setCandleData] = useState(candleMockData);
  const [selectedTimeScale, setSelectedTimeScale] = useState('1d');

  const handleButtonClick = () => {
    setCandleData((prevData) => generateCandleData(prevData));
  };
  return (
    <div>
      <Header />
      <Layout paddingX="px-[22vw]" flex={false}>
        <TimeScaleSelector
          selectedTimeScale={selectedTimeScale}
          setSelectedTimeScale={setSelectedTimeScale}
        />
        <Chart data={candleData} />
        <button onClick={handleButtonClick}>Generate More Data</button>
      </Layout>
    </div>
  );
};

export default Home;
