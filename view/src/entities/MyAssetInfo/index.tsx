import React from 'react';
import BoxContainer from './UI/BoxContainer';
import Title from './UI/Title';

type MyAssetInfoProps = {
  currency_code: string;
  amount: number;
};

const MyAssetInfo: React.FC<MyAssetInfoProps> = ({ currency_code, amount }) => {
  return (
    <BoxContainer>
      <Title currency_code={currency_code} amount={amount} />
    </BoxContainer>
  );
};

export default MyAssetInfo;
