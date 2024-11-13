import Chart from '../../entities/Chart';
import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';
import candleData from './consts/candleData';

const Home = () => {
  return (
    <div>
      <Header />
      <Layout paddingX="px-[22vw]">
        <Chart data={candleData} />
      </Layout>
    </div>
  );
};

export default Home;
