import React from 'react';
import BoxContainer from './UI/BoxContainer';

type MyAssetInfoProps = {
  currency_code: string;
  amount: number;
};

const MyAssetInfo: React.FC<MyAssetInfoProps> = ({ currency_code, amount }) => {
  return <BoxContainer>{currency_code}</BoxContainer>;
};

export default MyAssetInfo;
