import React from 'react';
import image from '../consts/mockImg.png';
import { MyAsset } from '../../../shared/types/MyAsset';

const AssetItem: React.FC<MyAsset> = ({ currency_code, name, amount }) => {
  return (
    <li className="h-[4rem] flex justify-between items-center px-[5.5vw] py-[0.5rem] hover:bg-surface-hover-light">
      <div className="flex items-center gap-[1.5vw]">
        <img src={image} alt="assetImage" width="36px" height="36px" />
        <div className="flex flex-col">
          <div className="h-[1rem] text-display-bold-16">{name}</div>
          <div className="h-[1rem] text-available-medium-14 text-text-dark">{currency_code}</div>
        </div>
      </div>

      <div className="flex">
        <div className="text-display-bold-16 mr-[0.5rem]">{amount.toLocaleString()}</div>
        <div>{currency_code}</div>
      </div>
    </li>
  );
};

export default AssetItem;
