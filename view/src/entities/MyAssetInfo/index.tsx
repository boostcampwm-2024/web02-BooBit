import React, { useState } from 'react';
import BoxContainer from './UI/BoxContainer';
import Title from './UI/Title';
import Tab from './UI/Tab';
import TransactionForm from './UI/TransactionForm';
import assetHistory from './consts/historyMockData';
import TransactionLogItem from './UI/TransactionLogItem';

type MyAssetInfoProps = {
  currency_code: string;
  amount: number;
};

const MyAssetInfo: React.FC<MyAssetInfoProps> = ({ currency_code, amount }) => {
  const [selectedCate, setSelectedCate] = useState('내역');
  const [withdrawlAmount, setWithdrawlAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  const handleWithdrawl = () => {
    alert(`{
	"currency_code": ${currency_code},
	"amount": ${withdrawlAmount}
}`);
  };
  const handleDeposit = () => {
    alert(`{
	"currency_code": ${currency_code},
	"amount": ${depositAmount}
}`);
  };

  return (
    <BoxContainer>
      <Title currency_code={currency_code} amount={amount} />
      <Tab selectedCate={selectedCate} setSelectedCate={setSelectedCate} />
      {selectedCate === '내역' && (
        <ul className="w-[100%] h-[17rem] px-[3vw] overflow-y-auto">
          {assetHistory.transactions.map((log) => (
            <TransactionLogItem log={log} currency_code={currency_code} />
          ))}
        </ul>
      )}
      {selectedCate === '입금' && (
        <TransactionForm
          type="입금"
          handleSubmit={handleWithdrawl}
          amount={withdrawlAmount}
          setAmount={setWithdrawlAmount}
        />
      )}
      {selectedCate === '출금' && (
        <TransactionForm
          type="출금"
          handleSubmit={handleDeposit}
          amount={depositAmount}
          setAmount={setDepositAmount}
        />
      )}
    </BoxContainer>
  );
};

export default MyAssetInfo;
