import React, { useState } from 'react';
import BoxContainer from './UI/BoxContainer';
import Title from './UI/Title';
import Tab from './UI/Tab';
import TransactionForm from './UI/TransactionForm';

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
      {selectedCate === '입금' ? <TransactionForm type="입금" /> : ''}
      {selectedCate === '출금' ? <TransactionForm type="출금" /> : ''}
    </BoxContainer>
  );
};

export default MyAssetInfo;
