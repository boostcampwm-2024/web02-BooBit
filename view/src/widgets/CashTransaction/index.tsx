import { useState } from 'react';
import MyAssetInfo from '../../entities/MyAssetInfo';
import MyAssetList from '../../entities/MyAssetList';
import useGetAssets from '../../shared/model/useGetAssets';

const CashTransaction = () => {
  const [selectedAssetIdx, setSelectedAssetIdx] = useState(0);

  const { data: assets } = useGetAssets();

  return assets ? (
    <div>
      <MyAssetList assetList={assets} setSelectedAssetIdx={setSelectedAssetIdx}></MyAssetList>
      <MyAssetInfo
        currencyCode={assets[selectedAssetIdx].currencyCode}
        amount={assets[selectedAssetIdx].amount}
      ></MyAssetInfo>
    </div>
  ) : (
    <div></div>
  );
};

export default CashTransaction;
