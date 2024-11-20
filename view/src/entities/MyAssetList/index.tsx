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
      <ul className="h-[10rem] overflow-y-auto">
        {assetList.map((a, i) => {
          return (
            <AssetItem key={a.currencyCode} asset={a} handleClick={() => setSelectedAssetIdx(i)} />
          );
        })}
      </ul>
    </BoxContainer>
  );
};

export default MyAssetList;
