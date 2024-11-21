import { useState } from 'react';
import MyAssetInfo from '../../entities/MyAssetInfo';
import MyAssetList from '../../entities/MyAssetList';
import useGetAssets from './model/useGetAssets';

const CashTransaction = () => {
  const [selectedAssetIdx, setSelectedAssetIdx] = useState(0);

  const { data: assetList } = useGetAssets();

  return assetList ? (
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
  ) : (
    <div></div>
  );
};

export default CashTransaction;
