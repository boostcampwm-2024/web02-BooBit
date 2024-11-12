import Chart from '../../entities/Chart';
import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';

const Home = () => {
  return (
    <div>
      <Header />
      <Layout paddingX="px-[22vw]">
        <Chart />
      </Layout>
    </div>
  );
};

export default Home;
