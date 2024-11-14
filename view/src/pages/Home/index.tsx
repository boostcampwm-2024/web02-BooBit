import { useState } from 'react';
import Chart from '../../entities/Chart';
import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';
import candleMockData from './consts/candleData';
import generateCandleData from './lib/generateCandleData';

const Home = () => {
  const [candleData, setCandleData] = useState(candleMockData);

  const handleButtonClick = () => {
    setCandleData((prevData) => generateCandleData(prevData)); // 버튼 클릭 시 데이터 업데이트
  };
  return (
    <div>
      <Header />
      <Layout paddingX="px-[22vw]" flex={false}>
        <Chart data={candleData} />
        <button onClick={handleButtonClick}>Generate More Data</button>
      </Layout>
    </div>
  );
};

export default Home;
