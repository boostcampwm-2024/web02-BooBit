import BoxContainer from './UI/BoxContainer';
import InfoBar from './UI/InfoBar';
import AssetItem from './UI/AssetItem';
import { MyAsset } from '../../shared/types/MyAsset';

type AssetListProps = {
  assetList: MyAsset[];
};

const MyAssetList = ({ assetList }: AssetListProps) => {
  return (
    <BoxContainer>
      <InfoBar />
      <ul className="h-[calc(100%-2rem)] overflow-y-scroll">
        {assetList.map((a) => {
          return <AssetItem key={a.currency_code} {...a} />;
        })}
      </ul>
    </BoxContainer>
  );
};

export default MyAssetList;
