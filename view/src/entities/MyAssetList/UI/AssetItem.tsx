import React from 'react';
import image from '../consts/mockImg.png';
import { MyAsset } from '../../../shared/types/MyAsset';

type AssetItemProps = {
  asset: MyAsset;
  handleClick: () => void;
};

const AssetItem: React.FC<AssetItemProps> = ({ asset, handleClick }) => {
  return (
    <li
      className="h-[4rem] flex justify-between items-center px-[5.5vw] py-[0.5rem] hover:bg-surface-hover-light"
      onClick={handleClick}
    >
      <div className="flex items-center gap-[1.5vw]">
        <img src={image} alt="assetImage" width="36px" height="36px" />
        <div className="flex flex-col">
          <div className="h-[1rem] text-display-bold-16">{asset.name}</div>
          <div className="h-[1rem] text-available-medium-14 text-text-dark">
            {asset.currencyCode}
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="text-display-bold-16 mr-[0.5rem]">{asset.amount.toLocaleString()}</div>
        <div>{asset.currencyCode}</div>
      </div>
    </li>
  );
};

export default AssetItem;
