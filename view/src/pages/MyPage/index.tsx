import { useState } from 'react';
import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';
import MainviewLayout from './UI/MainviewLayout';
import SubviewLayout from './UI/SubviewLayout';
import CategoryItem from './UI/CategoryItem';
import Title from './UI/Title';
import MyInfo from '../../entities/MyInfo';
import MyAssetInfo from '../../entities/MyAssetInfo';
import MyAssetList from '../../entities/MyAssetList';

import CATEGORY from './consts/category';
import useGetAssets from './model/useGetAssets';
import MyTradeHistory from '../../entities/MyTradeHistory';
import MyOpenOrders from '../../entities/MyOpenOrders';

const Home = () => {
  const [selectedCateIdx, setSelectedCateIdx] = useState(0);
  const [selectedAssetIdx, setSelectedAssetIdx] = useState(0);

  const { data: assetList } = useGetAssets();

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
          {selectedCateIdx === 1 && assetList && (
            <div>
              <MyAssetList
                assetList={assetList.assets}
                setSelectedAssetIdx={setSelectedAssetIdx}
              ></MyAssetList>
              <MyAssetInfo
                currencyCode={assetList.assets[selectedAssetIdx].currencyCode}
                amount={assetList.assets[selectedAssetIdx].amount}
              ></MyAssetInfo>
            </div>
          )}
          {selectedCateIdx === 2 && (
            <div>
              <MyTradeHistory />
              <MyOpenOrders />
            </div>
          )}
        </MainviewLayout>
      </Layout>
    </div>
  );
};

export default Home;
