import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';
import VerticalDivider from './UI/VerticalDivider';

const Home = () => {
  return (
    <div>
      <Header />
      <Layout paddingX="px-[14vw]">
        마이페이지
        <VerticalDivider />
      </Layout>
    </div>
  );
};

export default Home;
