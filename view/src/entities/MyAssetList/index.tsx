import BoxContainer from './UI/BoxContainer';
import InfoBar from './UI/InfoBar';
import AssetItem from './UI/AssetItem';
import { MyAsset } from '../../shared/types/MyAsset';

type AssetListProps = {
  assetList: MyAsset[];
  setSelectedAssetIdx: React.Dispatch<React.SetStateAction<number>>;
};

const MyAssetList = ({ assetList, setSelectedAssetIdx }: AssetListProps) => {
  return (
    <BoxContainer>
      <InfoBar />
      <ul className="h-[calc(100%-2rem)] overflow-y-scroll">
        {assetList.map((a, i) => {
          return (
            <AssetItem key={a.currency_code} asset={a} handleClick={() => setSelectedAssetIdx(i)} />
          );
        })}
      </ul>
    </BoxContainer>
  );
};

export default MyAssetList;
