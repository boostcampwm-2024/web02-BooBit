import { useState } from 'react';
import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';
import MainviewLayout from './UI/MainviewLayout';
import SubviewLayout from './UI/SubviewLayout';
import CategoryItem from './UI/CategoryItem';
import Title from './UI/Title';
import MyInfo from '../../entities/MyInfo';

import CATEGORY from './consts/category';
import MyOrderHistory from '../../entities/MyOrderHistory';
import MyOpenOrders from '../../entities/MyOpenOrders';
import CashTransaction from '../../widgets/CashTransaction';
import MyTradeHistory from '../../entities/MyTradeHistory';

const Home = () => {
  const [selectedCateIdx, setSelectedCateIdx] = useState(0);

  const moveCategory = (categoryIdx: number) => {
    setSelectedCateIdx(categoryIdx);
  };

  return (
    <div>
      <Header />
      <Layout paddingX="px-[14vw]">
        <SubviewLayout>
          {CATEGORY.map((c, i) => (
            <CategoryItem
              key={c}
              category={c}
              isSelected={selectedCateIdx === i}
              onClick={() => moveCategory(i)}
            />
          ))}
        </SubviewLayout>
        <MainviewLayout>
          <Title content={CATEGORY[selectedCateIdx]} />
          {selectedCateIdx === 0 && <MyInfo />}
          {selectedCateIdx === 1 && <CashTransaction />}
          {selectedCateIdx === 2 && (
            <div>
              <MyTradeHistory />
              <MyOpenOrders />
              <MyOrderHistory />
            </div>
          )}
        </MainviewLayout>
      </Layout>
    </div>
  );
};

export default Home;
