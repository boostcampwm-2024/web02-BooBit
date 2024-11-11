import React, { useState } from 'react';
import BoxContainer from './UI/BoxContainer';
import Title from './UI/Title';
import Tab from './UI/Tab';

type MyAssetInfoProps = {
  currency_code: string;
  amount: number;
};

const MyAssetInfo: React.FC<MyAssetInfoProps> = ({ currency_code, amount }) => {
  const [selectedCate, setSelectedCate] = useState('내역');
  return (
    <BoxContainer>
      <Title currency_code={currency_code} amount={amount} />
      <Tab selectedCate={selectedCate} setSelectedCate={setSelectedCate} />
    </BoxContainer>
  );
};

export default MyAssetInfo;
