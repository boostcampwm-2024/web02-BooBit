import { useEffect, useState } from 'react';
import Header from '../../widgets/Header';
import Layout from '../../widgets/Layout';
import MainviewLayout from './UI/MainviewLayout';
import SubviewLayout from './UI/SubviewLayout';
import VerticalDivider from './UI/VerticalDivider';
import CategoryItem from './UI/CategoryItem';
import Title from './UI/Title';

import MyAssetList from '../../entities/MyAssetList';

import CATEGORY from './consts/category';
import MyAssetInfo from '../../entities/MyAssetInfo';
import useGetAssets from './model/useGetAssets';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [selectedCateIdx, setSelectedCateIdx] = useState(0);
  const [selectedAssetIdx, setSelectedAssetIdx] = useState(0);

  const { data: assetList, isError, error } = useGetAssets();

  const moveCategory = (categoryIdx: number) => {
    setSelectedCateIdx(categoryIdx);
  };

  useEffect(() => {
    if (isError && error instanceof Response && error.status === 403) {
      navigate('/signin');
    }
  }, [isError, error, navigate]);

  if (!assetList) {
    return <p className="text-text-light">Loading or no data available</p>;
  }
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
          {selectedCateIdx === 1 && (
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
        </MainviewLayout>
      </Layout>
    </div>
  );
};

export default Home;
