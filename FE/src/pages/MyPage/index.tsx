import { useState } from 'react';
import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';
import MainviewLayout from './UI/MainviewLayout';
import SubviewLayout from './UI/SubviewLayout';
import VerticalDivider from './UI/VerticalDivider';
import CategoryItem from './UI/CategoryItem';
import Title from './UI/Title';

import MyAssetList from '../../entities/MyAssetList';

import CATEGORY from './consts/category';
import mockAssetListData from './consts/mockData';

const Home = () => {
  const [selectedCateIdx, setSelectedCateIdx] = useState(0);
  const [selectedAssetIdx, setSelectedAssetIdx] = useState(0);

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

        <VerticalDivider />

        <MainviewLayout>
          <Title content={CATEGORY[selectedCateIdx]} />
          {selectedCateIdx === 1 ? (
            <div>
              <MyAssetList
                assetList={mockAssetListData.assets}
                setSelectedAssetIdx={setSelectedAssetIdx}
              />
              <div>{JSON.stringify(mockAssetListData.assets[selectedAssetIdx])}</div>
            </div>
          ) : null}
        </MainviewLayout>
      </Layout>
    </div>
  );
};

export default Home;
